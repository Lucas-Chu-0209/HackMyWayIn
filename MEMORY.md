# Project Memory — Hack My Way In

This file captures important project context, architectural decisions, optimization findings, and a
follow-up checklist for future sessions.

---

## Project Overview

- **Author:** Lucas Chu
- **Repo:** `Lucas-Chu-0209/HackMyWayIn`
- **Production URL:** `https://hackmywayin.vercel.app`
- **Framework:** Next.js (App Router, React Server Components)
- **Language:** TypeScript + Tailwind CSS
- **Content:** MDX files in `src/content/posts/`
- **Analytics:** Vercel KV (views, visitors)

---

## Architecture Summary

### Pages

| Route | File | Notes |
|---|---|---|
| `/` | `src/app/page.tsx` | Home — hero + latest posts + sidebar |
| `/posts` | `src/app/posts/page.tsx` | Paginated post archive + sidebar |
| `/posts/[slug]` | `src/app/posts/[slug]/page.tsx` | Individual post detail + sidebar |
| `/about` | `src/app/about/page.tsx` | About / projects / contact + sidebar |
| `/categories/[slug]` | `src/app/categories/[slug]/page.tsx` | Posts filtered by category |
| `/tags/[slug]` | `src/app/tags/[slug]/page.tsx` | Posts filtered by tag |

### Key Data Flow

```
Page component
  ├── getAllPosts()             ← reads all .mdx files, runs compileMDX for frontmatter
  ├── getImportantPosts()      → calls getAllPosts() internally
  ├── getPostsPage()           → calls getAllPosts() internally
  ├── getLatestPostDate()      → calls getAllPosts() internally
  ├── getTotalWordCount()      → calls getAllPosts() internally
  ├── getTagSlugMap()
  │     └── getAllTags()       → calls getAllPosts() internally
  ├── getCategorySlugMap()
  │     └── getAllCategories() → calls getAllPosts() internally
  └── getSiteAnalyticsTotals() → Vercel KV network call (always dynamic)

BlogSidebar (async Server Component, rendered TWICE per page: desktop + mobile)
  └── getTagSlugMap() + getCategorySlugMap() → more getAllPosts() calls
```

---

## Performance Optimization — August 2026

### Root Cause

`getAllPosts()` was being called **7–9 times per page render** with no deduplication. Each call:
1. Read every MDX file from disk (`fs.readdir` + `fs.readFile`)
2. Ran `compileMDX` on each file (CPU-intensive MDX/frontmatter parsing)

The `BlogSidebar` is rendered twice per page (desktop and mobile) and internally re-calls
`getTagSlugMap()` / `getCategorySlugMap()`, each of which calls `getAllPosts()` again.

### Fix Applied

Wrapped `getAllPosts`, `getAllTags`, and `getAllCategories` in `src/lib/posts.ts` with React's
`cache()` function. This deduplicates all calls within a single server render so the MDX filesystem
work runs **once per request** regardless of how many callers invoke it.

```diff
- export async function getAllPosts(): Promise<PostSummary[]> {
+ export const getAllPosts = cache(async function getAllPosts(): Promise<PostSummary[]> {
  …
- }
+ });
```

Same pattern applied to `getAllTags` and `getAllCategories`.

### Files Changed

| File | Change |
|---|---|
| `src/lib/posts.ts` | Added `import { cache }` from React; wrapped 3 functions with `cache()` |
| `README.md` | Added Performance Notes section |
| `AGENT.md` | Created (new file) |
| `MEMORY.md` | Created (new file) |

### Impact

- **Before:** 7–9× `getAllPosts()` executions per page → 7–9× disk reads × (number of MDX posts)
- **After:** 1× execution per request, all callers share the cached result
- The sidebar double-render cost is fully eliminated

---

## Known Constraints

- All four main pages call `noStore()` (or transitively trigger it via `getSiteAnalyticsTotals()`).
  This makes them **always dynamically rendered** — they cannot be statically cached by Next.js at
  the route level. This is intentional because analytics data must be fresh.
- The `BlogSidebar` is an async Server Component rendered twice (desktop sticky + mobile below-fold).
  This is by design for the responsive layout; `cache()` handles the duplication cost.
- `getPostBySlug()` is NOT wrapped with `cache()` because it takes a dynamic argument (`slug`) and is
  only called once per post page — no deduplication benefit.

---

## Follow-up Checklist for Future Sessions

- [ ] Consider using `next/unstable_cache` (or `revalidate`) for post data to cache across requests,
      not just within a single request — would require removing `noStore()` from analytics or
      splitting analytics into a separate streaming island.
- [ ] Add loading skeletons (`loading.tsx`) for each page to improve perceived performance on first
      navigation.
- [ ] Consider suspense-wrapping `BlogSidebar` so the main page content shows immediately while the
      sidebar loads separately.
- [ ] Evaluate whether analytics live-count polling interval is necessary (currently updates on the
      `analytics:tracked` custom event only, which is fine).
- [ ] Add `generateStaticParams` to `/categories/[slug]` and `/tags/[slug]` routes for full static
      generation of taxonomy pages.
- [ ] Reading time estimation per post (using existing `wordCount` field).

---

## Where to Find Project Files in GitHub Copilot

GitHub Copilot Memory files are not displayed in a special UI inside Copilot itself — they live in
your repository as regular files. To reference them:

1. **In Copilot Chat (VS Code):** Open the file (`MEMORY.md`, `AGENT.md`) and paste relevant
   sections into your prompt, or use `#MEMORY.md` file references.
2. **In GitHub:** They appear under the repo root, visible in the file browser.
3. **Copilot Coding Agent sessions:** The agent reads `AGENTS.md` automatically at session start.
   For `MEMORY.md` and `AGENT.md`, include them explicitly in your prompt or they may not be loaded.
