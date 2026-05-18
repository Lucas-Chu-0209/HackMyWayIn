import fs from "node:fs/promises";
import path from "node:path";

import { compileMDX } from "next-mdx-remote/rsc";
import { createElement } from "react";
import type { ReactElement, ReactNode } from "react";

export type PostFrontmatter = {
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  cover: string;
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

function assertFrontmatter(frontmatter: PostFrontmatter, slug: string) {
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
      const { frontmatter } = await compileMDX<PostFrontmatter>({
        source,
        options: {
          parseFrontmatter: true,
        },
      });

      assertFrontmatter(frontmatter, slug);

      return {
        slug,
        ...frontmatter,
      };
    }),
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
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

    const { frontmatter, content } = await compileMDX<PostFrontmatter>({
      source,
      options: {
        parseFrontmatter: true,
      },
      components: {
        h2: ({ children }: { children: ReactNode }) => createElement("h2", { id: nextHeadingId() }, children),
        h3: ({ children }: { children: ReactNode }) => createElement("h3", { id: nextHeadingId() }, children),
      },
    });

    assertFrontmatter(frontmatter, slug);

    return {
      slug,
      ...frontmatter,
      content,
      toc,
    };
  } catch {
    return null;
  }
}
