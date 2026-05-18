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
};

export type Post = PostSummary & {
  content: ReactElement;
  toc: TocItem[];
};

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TOC_MIN_HEADING_LEVEL = 2;
const TOC_MAX_HEADING_LEVEL = 3;
const DEFAULT_IMPORTANCE: PostImportance = 3;

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

function sortPostsByImportance(a: PostSummary, b: PostSummary) {
  return Number(b.featured) - Number(a.featured) || b.importance - a.importance || b.date.localeCompare(a.date);
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
  return posts.sort(sortPostsByImportance).slice(0, normalizePositiveInteger(limit, 5));
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
