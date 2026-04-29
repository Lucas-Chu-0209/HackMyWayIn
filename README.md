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
- Projects (title, description, tags, links)
- Contact links (email, GitHub, LinkedIn, etc.)

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

## Roadmap

- [ ] Replace avatar placeholder with real photo or 3D embed
- [ ] Fill in real project links (GitHub, Demo, Write-up)
- [ ] Add contact links (LinkedIn, Instagram, Facebook)
- [ ] Dark mode toggle
- [ ] Daily challenge / rating system (bonus)

