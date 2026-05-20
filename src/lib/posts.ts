import fs from "node:fs/promises";
import path from "node:path";

import { compileMDX } from "next-mdx-remote/rsc";
import { createElement } from "react";
import type { ReactElement, ReactNode } from "react";

export type PostImportance = 1 | 2 | 3 | 4 | 5;

type ParsedPostFrontmatter = {
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  cover: string;
  importance?: number;
  featured?: boolean;
  draft?: boolean;
};

export type PostFrontmatter = {
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  cover: string;
  importance: PostImportance;
  featured: boolean;
};

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type PostSummary = PostFrontmatter & {
  slug: string;
  wordCount: number;
};

export type Post = PostSummary & {
  content: ReactElement;
  toc: TocItem[];
};

export type TaxonomyItem = {
  name: string;
  slug: string;
  count: number;
};

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TOC_MIN_HEADING_LEVEL = 2;
const TOC_MAX_HEADING_LEVEL = 3;
const DEFAULT_IMPORTANCE: PostImportance = 3;
const DEFAULT_TAXONOMY_SLUG = "item";
const CJK_CHARACTER_PATTERN = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;
// Includes both straight apostrophe (') and curly apostrophe (\u2019).
const LATIN_WORD_PATTERN = /[A-Za-z0-9]+(?:['\u2019][A-Za-z0-9]+)*/g;

export const POSTS_PAGE_SIZE = 9;

function normalizePositiveInteger(value: number, fallback: number) {
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function normalizeFrontmatter(frontmatter: ParsedPostFrontmatter, slug: string) {
  if (!frontmatter.title || typeof frontmatter.title !== "string") {
    throw new Error(`Invalid frontmatter.title in post: ${slug}`);
  }
  if (!DATE_PATTERN.test(frontmatter.date)) {
    throw new Error(`Invalid frontmatter.date in post: ${slug}. Expected YYYY-MM-DD`);
  }
  const [year, month, day] = frontmatter.date.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    throw new Error(`Invalid frontmatter.date in post: ${slug}. Expected a real calendar date`);
  }
  if (!frontmatter.category || typeof frontmatter.category !== "string") {
    throw new Error(`Invalid frontmatter.category in post: ${slug}`);
  }
  if (!Array.isArray(frontmatter.tags) || frontmatter.tags.some((tag) => typeof tag !== "string")) {
    throw new Error(`Invalid frontmatter.tags in post: ${slug}`);
  }
  if (!frontmatter.excerpt || typeof frontmatter.excerpt !== "string") {
    throw new Error(`Invalid frontmatter.excerpt in post: ${slug}`);
  }
  if (!frontmatter.cover || typeof frontmatter.cover !== "string") {
    throw new Error(`Invalid frontmatter.cover in post: ${slug}`);
  }

  if (
    frontmatter.importance !== undefined &&
    (!Number.isInteger(frontmatter.importance) || frontmatter.importance < 1 || frontmatter.importance > 5)
  ) {
    throw new Error(`Invalid frontmatter.importance in post: ${slug}. Expected an integer from 1 to 5`);
  }

  if (frontmatter.featured !== undefined && typeof frontmatter.featured !== "boolean") {
    throw new Error(`Invalid frontmatter.featured in post: ${slug}`);
  }

  if (frontmatter.draft !== undefined && typeof frontmatter.draft !== "boolean") {
    throw new Error(`Invalid frontmatter.draft in post: ${slug}`);
  }

  return {
    frontmatter: {
      title: frontmatter.title,
      date: frontmatter.date,
      category: frontmatter.category,
      tags: frontmatter.tags,
      excerpt: frontmatter.excerpt,
      cover: frontmatter.cover,
      importance: (frontmatter.importance ?? DEFAULT_IMPORTANCE) as PostImportance,
      featured: frontmatter.featured === true,
    },
    draft: frontmatter.draft === true,
  };
}

function sortPostsByImportanceAndDate(a: PostSummary, b: PostSummary) {
  return b.importance - a.importance || b.date.localeCompare(a.date);
}

async function readPostFile(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  return fs.readFile(filePath, "utf-8");
}

function stripFrontmatter(source: string) {
  if (!source.startsWith("---")) {
    return source;
  }

  const closingMarker = source.indexOf("\n---", 3);
  if (closingMarker === -1) {
    return source;
  }

  return source.slice(closingMarker + 4).trimStart();
}

function computeWordCount(source: string): number {
  let text = stripFrontmatter(source);
  // Strip fenced code blocks (``` ... ```)
  text = text.replace(/```[\s\S]*?```/g, " ");
  // Strip inline code (`...`)
  text = text.replace(/`[^`\n]*`/g, " ");
  // Strip HTML/JSX tags (<...>)
  text = text.replace(/<[^>]+>/g, " ");
  // Strip images ![alt](url) before link handling
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");
  // Unwrap markdown links [text](url) → text
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  // Strip heading markers at line start (allows optional trailing space per CommonMark;
  // {1,6} covers all six markdown heading levels)
  text = text.replace(/^#{1,6}\s*/gm, "");
  // Strip bold/italic markers
  text = text.replace(/[*_]{1,3}/g, " ");

  // Mixed-language counting examples:
  // - "資安 ABC 123" => 2 (CJK chars) + 2 (Latin words) = 4
  // - "今天學習 AI security" => 4 (CJK chars) + 2 (Latin words) = 6
  const cjkCharacterMatches = text.match(CJK_CHARACTER_PATTERN);
  const cjkCharCount = cjkCharacterMatches?.length ?? 0;

  // Remove CJK chars first so mixed strings are not double-counted by Latin word matching.
  const textWithoutCjk = text.replace(CJK_CHARACTER_PATTERN, " ");
  const latinWordMatches = textWithoutCjk.match(LATIN_WORD_PATTERN);
  const latinWordCount = latinWordMatches?.length ?? 0;

  return cjkCharCount + latinWordCount;
}

function sanitizeHeadingText(text: string) {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function generateHeadingId(baseId: string, count: number, index: number) {
  if (count > 0) {
    return `${baseId}-${count}`;
  }

  if (baseId === "section") {
    return `section-${index}`;
  }

  return baseId;
}

function extractHeadings(source: string): TocItem[] {
  const body = stripFrontmatter(source);
  const lines = body.split("\n");
  const idCounts = new Map<string, number>();

  return lines
    .map((line) => line.match(/^(#{2,3})\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => ({
      level: match[1].length as 2 | 3,
      text: sanitizeHeadingText(match[2]),
    }))
    .filter((item) => item.level >= TOC_MIN_HEADING_LEVEL && item.level <= TOC_MAX_HEADING_LEVEL)
    .filter((item) => item.text.length > 0)
    .map((item, index) => {
      const baseId = slugifyHeading(item.text) || "section";
      const count = idCounts.get(baseId) ?? 0;
      idCounts.set(baseId, count + 1);

      return {
        ...item,
        id: generateHeadingId(baseId, count, index),
      };
    });
}

export async function getAllPosts(): Promise<PostSummary[]> {
  let entries: string[] = [];

  try {
    entries = await fs.readdir(POSTS_DIR);
  } catch {
    return [];
  }

  const slugs = entries.filter((file) => file.endsWith(".mdx")).map((file) => file.replace(/\.mdx$/, ""));

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const source = await readPostFile(slug);
      const { frontmatter } = await compileMDX<ParsedPostFrontmatter>({
        source,
        options: {
          parseFrontmatter: true,
        },
      });

      const normalized = normalizeFrontmatter(frontmatter, slug);

      if (normalized.draft) {
        return null;
      }

      return {
        slug,
        wordCount: computeWordCount(source),
        ...normalized.frontmatter,
      };
    }),
  );

  return posts.filter((post): post is PostSummary => Boolean(post)).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const source = await readPostFile(slug);
    const toc = extractHeadings(source);
    let currentHeadingIndex = 0;

    const nextHeadingId = () => {
      const id = toc[currentHeadingIndex]?.id ?? `section-${currentHeadingIndex}`;
      currentHeadingIndex += 1;
      return id;
    };

    const { frontmatter, content } = await compileMDX<ParsedPostFrontmatter>({
      source,
      options: {
        parseFrontmatter: true,
      },
      components: {
        h2: ({ children }: { children: ReactNode }) => createElement("h2", { id: nextHeadingId() }, children),
        h3: ({ children }: { children: ReactNode }) => createElement("h3", { id: nextHeadingId() }, children),
      },
    });

    const normalized = normalizeFrontmatter(frontmatter, slug);

    if (normalized.draft) {
      return null;
    }

    return {
      slug,
      wordCount: computeWordCount(source),
      ...normalized.frontmatter,
      content,
      toc,
    };
  } catch {
    return null;
  }
}

export async function getImportantPosts(limit = 5): Promise<PostSummary[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.featured).sort(sortPostsByImportanceAndDate).slice(0, normalizePositiveInteger(limit, 5));
}

export async function getPostsPage(page: number, pageSize: number): Promise<PostSummary[]> {
  const posts = await getAllPosts();
  const normalizedPage = normalizePositiveInteger(page, 1);
  const normalizedPageSize = normalizePositiveInteger(pageSize, POSTS_PAGE_SIZE);
  const startIndex = (normalizedPage - 1) * normalizedPageSize;

  return posts.slice(startIndex, startIndex + normalizedPageSize);
}

export async function getTotalPages(pageSize: number): Promise<number> {
  const posts = await getAllPosts();
  const normalizedPageSize = normalizePositiveInteger(pageSize, POSTS_PAGE_SIZE);

  return Math.max(1, Math.ceil(posts.length / normalizedPageSize));
}

export async function getLatestPostDate() {
  const posts = await getAllPosts();
  return posts[0]?.date ?? null;
}

/**
 * Converts taxonomy labels (tags/categories) into stable kebab-case route segments.
 * Uses NFKD normalization to keep accented Unicode input predictable, and then
 * lowercases output so case differences map consistently. Falls back to
 * DEFAULT_TAXONOMY_SLUG when input has no slug-safe characters so routing remains valid.
 */
function slugifyTaxonomyValue(value: string) {
  const slug = value
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || DEFAULT_TAXONOMY_SLUG;
}

function sortTaxonomyNames(names: Iterable<string>) {
  return [...new Set(names)]
    .map((name) => name.trim())
    .filter(Boolean)
    .sort(
      // Primary sort ignores case to keep navigation intuitive; tiebreaker preserves
      // deterministic output when names differ only by casing.
      (a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" }) || a.localeCompare(b),
    );
}

/**
 * Builds deterministic, collision-safe slug mappings for taxonomy names.
 * Names are sorted first, then duplicate base slugs are disambiguated by appending
 * an incrementing numeric suffix (`-1`, `-2`, ...), ensuring stable route output.
 */
function buildTaxonomySlugMap(names: Iterable<string>) {
  const sortedNames = sortTaxonomyNames(names);
  const slugCounts = new Map<string, number>();
  const byName = new Map<string, string>();
  const bySlug = new Map<string, string>();

  for (const name of sortedNames) {
    const baseSlug = slugifyTaxonomyValue(name);
    const duplicateCount = slugCounts.get(baseSlug) ?? 0;
    const slug = duplicateCount === 0 ? baseSlug : `${baseSlug}-${duplicateCount}`;

    slugCounts.set(baseSlug, duplicateCount + 1);
    byName.set(name, slug);
    bySlug.set(slug, name);
  }

  return { byName, bySlug };
}

function getSlugOrThrow(slugMap: Map<string, string>, name: string) {
  const slug = slugMap.get(name);

  if (!slug) {
    throw new Error(`Missing taxonomy slug mapping for "${name}"`);
  }

  return slug;
}

function getCountOrThrow(counts: Map<string, number>, name: string) {
  const count = counts.get(name);

  if (count === undefined) {
    throw new Error(`Missing taxonomy count for "${name}"`);
  }

  return count;
}

export async function getAllTags(): Promise<TaxonomyItem[]> {
  const posts = await getAllPosts();
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  const { byName } = buildTaxonomySlugMap(counts.keys());

  return sortTaxonomyNames(counts.keys()).map((name) => ({
    name,
    slug: getSlugOrThrow(byName, name),
    count: getCountOrThrow(counts, name),
  }));
}

export async function getAllCategories(): Promise<TaxonomyItem[]> {
  const posts = await getAllPosts();
  const counts = new Map<string, number>();

  for (const post of posts) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }

  const { byName } = buildTaxonomySlugMap(counts.keys());

  return sortTaxonomyNames(counts.keys()).map((name) => ({
    name,
    slug: getSlugOrThrow(byName, name),
    count: getCountOrThrow(counts, name),
  }));
}

export async function getPostsByTagSlug(
  slug: string,
): Promise<{ tag: TaxonomyItem; posts: PostSummary[]; tagSlugMap: Map<string, string> } | null> {
  const [tags, posts] = await Promise.all([getAllTags(), getAllPosts()]);
  const tagSlugMap = new Map(tags.map((tag) => [tag.name, tag.slug]));
  const tag = tags.find((item) => item.slug === slug);

  if (!tag) {
    return null;
  }

  return {
    tag,
    posts: posts.filter((post) => post.tags.includes(tag.name)),
    tagSlugMap,
  };
}

export async function getPostsByCategorySlug(
  slug: string,
): Promise<{ category: TaxonomyItem; posts: PostSummary[]; categorySlugMap: Map<string, string> } | null> {
  const [categories, posts] = await Promise.all([getAllCategories(), getAllPosts()]);
  const categorySlugMap = new Map(categories.map((category) => [category.name, category.slug]));
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return null;
  }

  return {
    category,
    posts: posts.filter((post) => post.category === category.name),
    categorySlugMap,
  };
}

export async function getTagSlugMap() {
  const tags = await getAllTags();
  return new Map(tags.map((tag) => [tag.name, tag.slug]));
}

export async function getCategorySlugMap() {
  const categories = await getAllCategories();
  return new Map(categories.map((category) => [category.name, category.slug]));
}

export async function getTotalWordCount(): Promise<number> {
  const posts = await getAllPosts();
  return posts.reduce((sum, post) => sum + post.wordCount, 0);
}
