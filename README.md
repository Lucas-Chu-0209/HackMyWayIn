# Hack My Way In

Personal brand and resume website for Lucas Chu.
Built with Next.js (App Router) + Tailwind CSS.

## Getting Started

### Run locally
```bash
npm install
npm run dev
```
Then open [http://localhost:3000](http://localhost:3000).

### Build for production
```bash
npm run build
npm start
```

## Content

All site content is centralized in `src/content.ts`.
Edit that file to update:
- Personal info, bio, tagline
- Skills (languages, tools)
- Education
- Experience
- Projects (title, description, tags, links, image)
- Contact links (email, GitHub, LinkedIn, etc.)

## Project Images

Project images live in `public/projects/` and are referenced from `src/content.ts`.

### Supported formats

PNG, JPG, WebP, and AVIF are all supported (handled natively by Next.js `next/image`). WebP is recommended for the best file-size-to-quality ratio; PNG is ideal when you need a transparent background.

### Card image presentation

The left panel of each project card uses a **4:3 aspect-ratio frame** with padding. Images are displayed with `object-contain`, so they are always shown in full without cropping. The frame's background colour (blue gradient) remains visible around the image on all sides, giving a clean, padded look.

- **Landscape / desktop demo images** — the image fills the width of the frame and gains top/bottom margins.
- **Portrait / mobile demo images** — the image fills the height of the frame and gains left/right margins.
- Both orientations display correctly on desktop and mobile screens.

### Recommended image dimensions

| Demo type | Ratio | Recommended resolution | Notes |
|-----------|-------|------------------------|-------|
| Desktop app / website | 16:10 or 4:3 | **1600 × 1000 px** (16:10) or **1200 × 900 px** (4:3) | Common browser-window screenshot ratios |
| Mobile app | 9:16 or 3:4 | **1080 × 1920 px** (9:16) or **1200 × 1600 px** (3:4) | Standard smartphone screenshot size |

Keep files **under 300 KB** — use WebP or optimise with tools like [Squoosh](https://squoosh.app/).

### Adding an image to a project

1. Add your image file to `public/projects/` (e.g. `public/projects/my-project.png`).
2. In `src/content.ts`, add an `image` field to the project entry:

```ts
{
  title: "My Project",
  // ...other fields...
  image: { src: "/projects/my-project.png", alt: "My Project preview" },
}
```

If no `image` field is provided (or the field is omitted), the card shows a decorative placeholder automatically.

## Avatar

The avatar is currently a placeholder (circular gradient with initials "LC").

To replace it:
1. **Photo**: Add your image to `public/avatar.png` and update `src/components/Avatar.tsx` to use `<Image src="/avatar.png" ... />` from `next/image`.
2. **3D / animated avatar**: Replace the contents of `src/components/Avatar.tsx` with your embed (Spline, Rive, Three.js, etc.).

## Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout + metadata
│   ├── page.tsx         # Main page (assembles sections)
│   └── globals.css      # Global styles (Tailwind base)
├── components/
│   ├── Navbar.tsx        # Sticky navbar, scroll hide/show, mobile drawer
│   ├── Avatar.tsx        # Avatar placeholder (swap later)
│   ├── SectionHeader.tsx # Section title + subtitle + accent bar
│   ├── SkillChip.tsx     # Skill tag badge
│   ├── TimelineItem.tsx  # Timeline entry (Education/Experience)
│   ├── ProjectCard.tsx   # Project display card
│   ├── SocialLinkButton.tsx  # Social/contact link button
│   ├── HeroSection.tsx   # Hero / landing section
│   ├── AboutSection.tsx  # About section
│   ├── ProjectsSection.tsx # Projects section
│   └── ContactSection.tsx  # Contact section
└── content.ts            # All site content data
```

## Deployment

Deploy to Vercel for free:
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com), import your repo
3. Deploy — Vercel auto-detects Next.js

### Analytics env vars (Vercel KV)

Analytics uses `@vercel/kv` with these server-side environment variables:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `VISITOR_SALT` (required in production for salted anonymous visitor hashing)

Key schema:

- `views:post:{slug}` → integer per post
- `views:total` → integer site-wide views
- `visitors:total:set` → set of salted anonymous visitor hashes
- `visitors:total` → integer site-wide unique visitors

On Vercel, add a Redis/KV integration first, then set `VISITOR_SALT` in Project Settings → Environment Variables.

### Local analytics setup

You can pull Vercel env vars without a global install:

```bash
npx vercel link
npx vercel env pull .env.local
```

If `npx vercel` is unavailable, manually create `.env.local` with the three variables above.

### Verify tracking works

1. Run `npm run dev`.
2. Open any post page and check Network for `POST /api/analytics/track`.
3. Confirm response JSON contains `ok: true` and `tracked: true`.
4. Navigate from Homepage to a post and confirm the post's `Views` increases immediately (no refresh required).
5. Confirm the response includes updated `postViews` / `totalViews` counts and the sidebar `Total Views` updates in-place.
6. Confirm `Visitors` increases when visiting from a new browser/session.

Notes:
- If KV env vars are missing, analytics intentionally returns `tracked: false` and logs a warning in development.
- If `VISITOR_SALT` is missing in production, view counters still increase but unique visitor counting is disabled.

## Roadmap

- [ ] Replace avatar placeholder with real photo or 3D embed
- [ ] Fill in real project links (GitHub, Demo, Write-up)
- [ ] Add contact links (LinkedIn, Instagram, Facebook)
- [ ] Dark mode toggle
- [ ] Daily challenge / rating system (bonus)
