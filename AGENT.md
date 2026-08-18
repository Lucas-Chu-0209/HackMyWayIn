# Agent Usage Boundaries & Regulations

This document defines what AI coding agents (GitHub Copilot, etc.) **can** and **cannot** do in this
repository, and provides a safe workflow for future optimization sessions.

---

## What an Agent IS Allowed to Do

- **Fix performance bottlenecks** in `src/lib/posts.ts`, `src/lib/analytics.ts`, and page components
  when there is a clearly identified root cause.
- **Add or update React `cache()` / `unstable_cache` wrappers** on data-fetching functions to
  deduplicate requests within a render.
- **Add new MDX posts** under `src/content/posts/` following the established frontmatter schema.
- **Update documentation** files: `README.md`, `AGENT.md`, `MEMORY.md`.
- **Add new UI components** under `src/components/` that follow the existing Tailwind + RSC patterns.
- **Fix lint errors** or TypeScript type errors introduced by its own changes.
- **Open pull requests** for review before any changes are merged.

---

## What an Agent MUST NOT Do

- **Restructure the app's routing** (the `src/app/` directory layout).
- **Remove or replace `BlogSidebar`** — the sidebar is intentional; optimize it, don't remove it.
- **Alter the analytics pipeline** (`src/lib/analytics.ts`, `src/app/api/analytics/`) beyond bug fixes.
- **Remove `noStore()`** from analytics functions — those calls must remain dynamic.
- **Change the MDX frontmatter schema** without updating all existing posts and the parser.
- **Upgrade major versions** of Next.js, React, or Tailwind without explicit user approval.
- **Add new external runtime dependencies** without checking security advisories first.
- **Alter or remove existing tests** (if any are added in future).
- **Commit secrets, API keys, or credentials** of any kind.
- **Push directly to `main`** — all changes must go through a PR.

---

## Safe Workflow for Future Optimization Sessions

1. **Read `MEMORY.md`** first to understand current project context and past decisions.
2. **Explore** `src/lib/posts.ts` and relevant page files before touching anything.
3. **Make the smallest possible change** that fixes the identified problem.
4. **Run `npm run lint`** to verify no lint regressions.
5. **Run `npx tsc --noEmit`** to verify TypeScript compiles.
6. **Update `MEMORY.md`** with the new finding or change summary.
7. **Open a PR** — never commit directly to the default branch.

---

## Key Files an Agent Should Know

| File | Purpose |
|---|---|
| `src/lib/posts.ts` | All MDX post data-fetching logic |
| `src/lib/analytics.ts` | Vercel KV analytics (views/visitors) |
| `src/components/BlogSidebar.tsx` | Sidebar (async Server Component, rendered twice per page) |
| `src/components/TransitionProvider.tsx` | Client-side page transition animation |
| `src/app/layout.tsx` | Root layout (Navbar, ThemeProvider, TransitionProvider) |
| `src/content/posts/` | MDX post files |
| `MEMORY.md` | Project context and past optimization decisions |

---

## Environment Variables Required in Production

| Variable | Purpose |
|---|---|
| `KV_REST_API_URL` | Vercel KV endpoint for analytics |
| `KV_REST_API_TOKEN` | Vercel KV auth token |
| `VISITOR_SALT` | Salt for unique-visitor hashing |
