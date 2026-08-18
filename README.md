# Hack My Way In

Personal website and technical blog for **Lucas Chu** — focused on web development, creative programming, networking, and cybersecurity learning notes.

## Live Site

- Production: `https://hackmywayin.vercel.app`

## Overview

Hack My Way In is a personal website built to serve as:

- a portfolio and personal brand site
- a technical writing platform
- a place to publish build logs, learning notes, and project updates
- a long-term knowledge base for networking and cybersecurity topics

The site is designed with a clean dark/light UI, responsive layouts, MDX-powered content, and a blog structure that can scale over time.

## Features

- **Responsive personal website**
  - works across desktop, tablet, and mobile layouts
- **MDX-based blog system**
  - write posts in Markdown/MDX with frontmatter metadata
- **Post taxonomy**
  - categories and tags for organizing content
- **Dark mode support**
  - theme-aware UI with smooth transitions
- **Homepage latest posts section**
  - highlights the newest published entries
- **Post detail pages**
  - dedicated article pages for long-form writing
- **Sidebar content**
  - important posts, analytics summaries, and related site information
- **Pagination**
  - archive browsing across multiple post pages
- **Vercel deployment**
  - optimized for production hosting on Vercel

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Content:** MDX / Markdown-based posts
- **Deployment:** Vercel

## Project Structure

```text
.
├── src
│   ├── app
│   │   ├── page.tsx
│   │   ├── posts
│   │   ├── categories
│   │   └── ...
│   ├── components
│   │   ├── posts
│   │   ├── Navbar.tsx
│   │   ├── BlogSidebar.tsx
│   │   └── ...
│   ├── content
│   │   └── posts
│   └── lib
│       └── posts.ts
├── public
│   └── images
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Lucas-Chu-0209/HackMyWayIn.git
cd HackMyWayIn
```

### 2. Install dependencies

Using npm:

```bash
npm install
```

Or using pnpm:

```bash
pnpm install
```

### 3. Start the development server

Using npm:

```bash
npm run dev
```

Or using pnpm:

```bash
pnpm dev
```

Then open:

```text
http://localhost:3000
```

## Writing a New Blog Post

Posts are stored as MDX/Markdown files under the content directory.

Example frontmatter:

```md
---
title: "Computer Networking (Ep1) — Host/End system, Network Edge"
date: "2026-05-28"
category: "Computer Network 筆記"
tags:
  - "Networking"
  - "Cybersec"
  - "Edge"
excerpt: "Host & End System 什麼是 Host（主機）/ End system（終端系統）呢？簡單來說就是：真正使用網路的那些設備..."
cover: "/images/posts/ithome-cybersec-cover.jpg"
importance: 4
---
```

After adding a new post file, it should automatically appear in:

- the homepage latest posts section
- the `/posts` archive
- relevant category pages
- relevant tag pages

## Deployment

This site is deployed on **Vercel**.

### Production URL

- `https://hackmywayin.vercel.app`

### Deploy with Vercel

1. Push your latest code to GitHub
2. Import the repository into Vercel
3. Vercel will automatically detect the Next.js project
4. Configure environment variables if needed
5. Deploy

For future updates:

- push changes to your branch
- merge into your main branch
- Vercel can automatically redeploy on new commits

## Recommended Git Workflow

Example workflow:

```bash
git checkout -b feature/update-readme
git add .
git commit -m "Update README for personal website"
git push origin feature/update-readme
```

Then open a pull request and merge into `main`.

## Design Goals

This project aims to balance:

- simplicity
- readability
- responsive UX
- maintainable content publishing
- long-term extensibility

The website is not just a portfolio, but also a public record of learning, writing, and building.

## Performance Notes

### Root Cause (identified August 2026)

All four key pages (Home, Posts, About, Post detail) were slow to render because `getAllPosts()` was
called **7+ times per page render** with no request-level deduplication:

| Caller | Calls `getAllPosts()` internally |
|---|---|
| `getAllPosts()` (direct) | ✓ |
| `getImportantPosts()` | ✓ (via `getAllPosts`) |
| `getPostsPage()` | ✓ (via `getAllPosts`) |
| `getLatestPostDate()` | ✓ (via `getAllPosts`) |
| `getTotalWordCount()` | ✓ (via `getAllPosts`) |
| `getTagSlugMap()` → `getAllTags()` | ✓ (via `getAllPosts`) |
| `getCategorySlugMap()` → `getAllCategories()` | ✓ (via `getAllPosts`) |
| `BlogSidebar` (desktop + mobile, each call) | +2 more (via `getTagSlugMap`/`getCategorySlugMap`) |

Each call reads **every MDX file from disk** and runs `compileMDX`, which is CPU-intensive.

### Fix Applied

`getAllPosts()`, `getAllTags()`, and `getAllCategories()` in `src/lib/posts.ts` are now wrapped with
React's `cache()` function. This deduplicates all calls within a single request — no matter how many
times these functions are called during one server render, the underlying filesystem+MDX work executes
only **once per request**.

```ts
// before
export async function getAllPosts() { … }

// after
export const getAllPosts = cache(async function getAllPosts() { … });
```

### Before / After (qualitative)

| Metric | Before | After |
|---|---|---|
| `getAllPosts` executions per page | 7–9× | 1× |
| Disk reads per page (MDX files) | 7–9× per post | 1× per post |
| `compileMDX` invocations per page | 7–9× per post | 1× per post |
| Sidebar data double-fetch (desktop + mobile) | yes | eliminated |

### Sidebar Architecture Note

`BlogSidebar` is rendered twice per page (once for the desktop sticky sidebar, once for the mobile
layout below the fold). With `cache()` applied, both instances share the same in-request data,
eliminating all duplicate work.

## Future Improvements

Possible future enhancements:

- automatic excerpt generation from MDX content
- search functionality for posts
- syntax highlighting improvements
- reading time estimation
- richer Open Graph metadata
- post series navigation
- better analytics dashboards
- internationalization support

## Author

**Lucas Chu**

- Personal site: `https://hackmywayin.vercel.app`

## License

This project is for personal website and content publishing use.

If you want to reuse parts of the codebase or structure, please check the repository license first or contact the author.
