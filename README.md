# Aditya Fadni Athaullah — Portfolio

A statically exported Next.js portfolio focused on production web work, full-stack projects, deployment infrastructure, education, and verified achievements.

## Stack

- Next.js App Router and React Server Components
- TypeScript
- Tailwind CSS with a small CSS-variable design system
- Static export for GitHub Pages

## Local development

```bash
npm install
npm run dev
```

Validation commands:

```bash
npm run lint
npm run typecheck
npm run build
```

The production build is written to `out/`.

## Game UI integration

The main menu combines scoped Minecraft-CSS surfaces, selected local mcicons PNGs,
and a bounded liquid-glass effect. See [the visual source audit](docs/VISUAL_SOURCES.md)
for source attribution, component ownership, icon usage, and graphics/motion fallbacks.

## Content and assets

Frequently updated content lives in `data/`. Project detail pages are generated from `data/projects.ts` through `app/projects/[slug]/page.tsx`.

Public assets live in:

- `public/images/profile.jpg`
- `public/images/projects/`
- `public/cv/Aditya_Fadni_Athaullah_CV_EN.pdf` and `public/cv/Aditya_Fadni_Athaullah_CV_ID.pdf`

When adding a project image, use a real product screenshot and provide meaningful alt text in the project data. Do not add private repository links, credentials, server addresses, or environment values.

## Contribution skyline

The Open Source section renders a 2D/3D contribution skyline
(`components/ui/ContributionSkyline.tsx`, a `"use client"` canvas component)
from `data/contributions.json`.

The JSON is refreshed from the public GitHub contribution calendar by
`scripts/sync-contributions.mjs` (no token needed). A pre-commit hook keeps it
fresh on every commit — the data rides along with the commit, so each push
deploys an up-to-date skyline:

```bash
npm run setup:hooks          # once per clone: use .githooks/
npm run contributions:sync   # manual refresh
```

If the sync fails (offline, GitHub hiccup), the hook warns and the commit
proceeds with the previously synced data.

## GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` installs dependencies, validates the project, builds the static export, and deploys `out/`.

In the GitHub repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The Next.js configuration derives the repository base path during Actions builds, so assets and routes work under `/portfolio/` while local development remains at `/`.

## Known content maintenance

The preserved CV PDF predates this portfolio refresh and still needs a manual content update to match the corrected 2026 profile and experience history. The site does not repeat the outdated claims from that PDF.
