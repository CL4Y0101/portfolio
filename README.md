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

## Content and assets

Frequently updated content lives in `data/`. Project detail pages are generated from `data/projects.ts` through `app/projects/[slug]/page.tsx`.

Public assets live in:

- `public/images/profile.jpg`
- `public/images/projects/`
- `public/cv/aditya-fadni-athaullah-cv.pdf`

When adding a project image, use a real product screenshot and provide meaningful alt text in the project data. Do not add private repository links, credentials, server addresses, or environment values.

## GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` installs dependencies, validates the project, builds the static export, and deploys `out/`.

In the GitHub repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The Next.js configuration derives the repository base path during Actions builds, so assets and routes work under `/portfolio/` while local development remains at `/`.

## Known content maintenance

The preserved CV PDF predates this portfolio refresh and still needs a manual content update to match the corrected 2026 profile and experience history. The site does not repeat the outdated claims from that PDF.
