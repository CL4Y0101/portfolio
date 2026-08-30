# Product Requirements Document

## Aditya Fadni Athaullah — Next.js Portfolio Migration & Professional Profile Refresh

**Repository:** `CL4Y0101/portfolio`
**Current branch:** `main`
**Current implementation:** Static HTML + CSS + vanilla JavaScript
**Target implementation:** Next.js App Router + TypeScript + Tailwind CSS
**Primary deployment:** GitHub Pages
**Current portfolio URL:** `https://cl4y0101.github.io/portfolio/`

---

# 1. Project Objective

Transform the existing static portfolio into a modern, production-quality Next.js portfolio while preserving its strongest visual identity and existing assets.

This is not only a framework migration.

The new portfolio must also accurately represent Aditya's current technical abilities, production work, projects, education, achievements, cloud/deployment experience, and professional direction as of 2026.

The portfolio should position Aditya as:

> **Software Developer & Informatics Engineering Student focused on modern web development, backend systems, deployment infrastructure, and practical software products.**

The portfolio must feel like it belongs to an actual developer who has shipped and maintained real systems.

Avoid generic portfolio-template language.

---

# 2. Current Repository State

The current repository contains approximately:

```text
/
├── index.html
├── style.css
├── script.js
└── src/
    ├── cv/
    └── img/
        ├── profile.jpg
        └── projects/
            ├── greenpoint-postgresql.png
            └── greenpoint-mysql.png
```

The current website already includes:

* hero section
* light/dark theme
* about
* skills
* experience
* achievements
* project filtering
* project cards
* GitHub information
* contact section
* responsive navigation
* animation/reveal effects
* profile image
* downloadable CV

These features should be preserved where they still make sense, but reimplemented cleanly using React and Next.js.

---

# 3. Problems With Current Portfolio

The existing portfolio has several content and architectural problems.

## 3.1 Technical Problems

The application is built from:

* one large `index.html`
* one large `style.css`
* one large `script.js`
* hardcoded DOM manipulation
* hardcoded project arrays
* manual UI state
* no reusable component structure
* no TypeScript
* no modern build pipeline

The migration should solve this.

---

## 3.2 Portfolio Content Problems

The portfolio currently contains too much generic self-description and too little evidence.

Examples of content that should be reduced or removed:

* "Fast learner"
* "Strong problem-solving skills"
* "Responsible and disciplined"
* arbitrary counters such as number of technologies
* generic project placeholders
* stock photography for projects
* generic "Network Lab" placeholder
* duplicated GreenPoint project cards based only on different database implementations

Recruiters should see actual work before personality claims.

---

# 4. Important Data Corrections

## 4.1 Remove Obsolete Experience

Remove:

```text
Network Technician
PT Digital Komunika Nusantara
```

Do not migrate this experience into the new portfolio.

Do not mention this company elsewhere.

---

## 4.2 Correct Kominfo Experience

Replace the generic current Kominfo description with a more accurate entry.

### Organization

Dinas Komunikasi dan Informatika / Kominfo Jember

### Type

Internship / PKL

### Division

Sekretariat

### Responsibilities

Use concise bullets based on actual work:

* administrative and operational data entry
* camera operation for government activities
* supporting YouTube livestream production
* assisting digital documentation for Dinas Jember activities
* collaborating with staff during public communication activities

Do NOT describe this primarily as a network technician or hardware support role.

---

# 5. Current Professional Experience — KandU

Add KandU as the most important current professional experience.

## Role

**Web Developer — Frontend & Backend**

## Organization

**KandU / Korea & You**

## Work Arrangement

Remote

## Location Context

South Korea-based product/team.

## Period

2026 – Present

## Description

Aditya contributes to the development and deployment of KandU, a multi-campus digital platform designed to help international students access university and campus information in South Korea.

The portfolio should explain the work in practical engineering terms.

Example responsibilities:

* developing and maintaining modern web interfaces with Next.js and React
* working on frontend and backend web functionality
* developing multi-campus routing and reusable site architecture
* integrating Firebase-backed application data
* working with campus information such as cafeteria menus, notices, maps, schedules, and other student information
* integrating or maintaining data produced by Python-based campus crawlers / automation pipelines
* maintaining production and beta deployment environments
* working with Linux-based Oracle Cloud infrastructure
* working with Nginx and Node.js application processes
* managing deployment through GitHub-based workflows
* debugging production build, dependency, networking, and deployment issues

Do not claim ownership of parts of the product that cannot be verified.

Use wording such as:

> "Worked on..."

> "Contributed to..."

> "Maintained..."

rather than exaggerating with:

> "Architected the entire..."

unless explicitly supported by repository evidence.

---

# 6. KandU Featured Project

KandU should be the first featured project.

## Project Name

**KandU Campus Platform**

## Subtitle

Multi-campus platform for international students in South Korea.

## Role

Web Developer — Frontend & Backend

## Status

Production / Active Development

## Links

Production:

`https://campus.kandu.kr`

Beta:

`https://beta.kandu.kr`

Display the links separately:

* View Production
* View Beta

If the source repository is private, DO NOT display a GitHub repository button.

Never reveal internal repository names without permission.

---

## Technology Stack

Show relevant technologies:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Firebase
* REST APIs
* Python automation / crawler integration
* Naver Maps / Leaflet
* Oracle Cloud
* Linux
* Nginx
* PM2
* GitHub Actions

Do not expose:

* server IP addresses
* environment variables
* Firebase credentials
* API keys
* internal infrastructure credentials
* private repository URLs
* secrets

---

## KandU Case Study Highlights

The project page should explain several engineering areas.

### Multi-campus architecture

Explain that the platform supports different campus/university environments through reusable architecture instead of maintaining completely separate websites.

### Data integration

Explain that campus data can come from Firebase and automated data collection pipelines.

### Production deployment

Explain experience deploying and maintaining Next.js applications on Linux infrastructure.

### Beta deployment

Mention that a separate beta environment is used for development/testing before production changes.

### CI/CD

Mention GitHub-based deployment workflows and release processes.

Do not publish sensitive infrastructure details.

---

# 7. GreenPoint Project Consolidation

The existing portfolio currently treats PostgreSQL GreenPoint and MySQL GreenPoint as separate projects.

That is misleading and should be changed.

They are different technical stages/environments of the same product.

Create ONE strong case study:

## Project Name

**GreenPoint — Digital Waste Bank Platform**

## Role

Full-stack development in a team.

## Description

A digital waste-bank management system designed to manage customers, recyclable waste categories, transactions, balances, withdrawals, and administrative reporting.

## Core functionality

Mention real functionality such as:

* user/customer registration
* account approval workflow
* waste type management
* deposit transactions
* balance management
* withdrawal management
* financial/reporting functionality
* Excel/PDF reporting
* admin management

## Technology evolution

Explain the technical evolution as part of the case study.

Possible stack:

* PHP
* Laravel
* Bootstrap
* JavaScript
* REST API
* PostgreSQL
* Supabase
* MySQL
* Flutter

Do NOT create:

```text
GreenPoint PostgreSQL
GreenPoint MySQL
```

as two separate featured projects.

Instead explain that database architecture evolved during development.

---

## Public repositories

When appropriate, link to:

`https://github.com/CL4Y0101/BankSampah-GreenPoint`

The implementation may also reference related mobile repositories if they are still valid and relevant.

Before publishing a live-demo link, verify that the URL is still reachable.

If a live environment is offline, hide the Live Demo button rather than showing a broken link.

---

# 8. Additional Projects

Featured projects should prioritize quality over quantity.

Target approximately 3–5 projects.

Recommended priority:

### 1. KandU Campus Platform

Production professional work.

### 2. GreenPoint

Main full-stack academic/product project.

### 3. Time Capsule

Inspect the `CL4Y0101/tiga-capsule` repository before writing the final project description.

Known technology includes:

* Next.js
* React
* TypeScript
* Cloudflare
* OpenNext
* Three.js
* React Three Fiber
* GSAP
* Groq SDK / generative AI integration

The final portfolio description must reflect actual implementation discovered in the repository.

Do not invent features based only on dependencies.

### 4. YouTube Music × ESP32

This may be included under **Experiments / In Progress** instead of the primary featured section.

Repository:

`CL4Y0101/ytbmusic-withesp32`

Current concept involves connecting web/browser media information with an ESP32 display.

Relevant technologies can include, when confirmed:

* JavaScript
* Chrome Extension APIs
* ESP32
* Arduino / C++
* Wi-Fi
* HTTP / JSON
* I2C LCD

Label it:

**In Progress**

until the project is complete.

Do not present unfinished experiments as production products.

---

# 9. Updated Professional Profile

Replace the current generic About Me section with stronger copy.

Suggested content:

## Hero eyebrow

```text
Software Developer · Informatics Engineering Student
```

## Hero heading

```text
Aditya Fadni Athaullah
```

## Hero description

```text
I build practical web applications, backend systems, deployment pipelines, and software products using modern web technologies, cloud infrastructure, and a strong networking foundation.
```

Alternative supporting text:

```text
Currently working across production web development, Firebase-backed systems, Linux deployment, and multi-campus platforms while studying Informatics Engineering at Politeknik Negeri Jember.
```

Do not make the hero overly long.

---

# 10. Education

## Politeknik Negeri Jember

Program:

**D4 Informatics Engineering / Teknologi Informasi**

Period:

**2024 – Present**

Current GPA:

**3.85**

Do not imply graduation.

---

## SMK Negeri 2 Jember

Major:

**Computer and Network Engineering / Teknik Komputer dan Jaringan**

The portfolio does not need to include elementary or junior-high school history.

Keep professional information relevant.

---

# 11. Leadership

Add a small optional Leadership section.

## Cohort Lead / Ketua Angkatan

Politeknik Negeri Jember

Suggested description:

```text
Coordinating communication and collaboration across the Informatics Engineering cohort while balancing academic and technical project responsibilities.
```

Keep this section small.

The technical portfolio must remain the primary focus.

---

# 12. Achievements and Certifications

Prioritize verified achievements.

## English Proficiency Test

Display:

```text
English Proficiency Test — Rank #1
Politeknik Negeri Jember, 2025
Score: 148 / 150
```

Certificate date:

```text
April 2025
```

This should be more prominent than generic personality statements.

---

## LSP Certification

Display the Computer and Network Engineering competency certification obtained through vocational school when relevant.

---

## Achievement-Based Admission

May be displayed as:

```text
Admitted to Politeknik Negeri Jember through the SNBP / achievement-based admission pathway.
```

---

## Certification verification rule

The current website contains a Cisco Networking Academy claim.

Do not automatically preserve that claim.

Only display a named Cisco certification if there is clear certificate evidence.

Knowing Cisco networking concepts or using Cisco Packet Tracer is not the same thing as holding a Cisco professional certification.

Never upgrade experience into a certification claim.

---

# 13. Skills Redesign

Do NOT create percentage bars such as:

```text
Next.js 90%
Laravel 85%
```

These percentages are meaningless.

Instead organize technologies by practical category.

---

## Current Web Stack

Prioritize:

* JavaScript
* TypeScript
* React
* Next.js
* Tailwind CSS
* HTML
* CSS
* PHP
* Laravel
* Node.js
* Express.js
* REST APIs

---

## Data & Backend

* Firebase
* MySQL
* PostgreSQL
* Supabase
* MongoDB

Only show tools the user has actually worked with.

---

## DevOps & Cloud

Add the infrastructure skills currently missing from the old portfolio:

* Git
* GitHub
* GitHub Actions
* Linux
* Nginx
* PM2
* Docker
* Oracle Cloud
* Cloudflare
* OpenNext
* Fly.io
* Heroku

These should not all have equal visual weight.

Prioritize tools associated with real deployed projects.

---

## Automation / Programming

* Python
* Java
* C++
* Dart
* Flutter

Python should mention practical automation / crawler work rather than presenting Aditya as primarily a Python engineer.

---

## Networking

Preserve the networking foundation:

* Routing
* OSPF
* MikroTik
* Cisco Packet Tracer
* Wireshark
* LAN/WAN troubleshooting
* Network infrastructure

---

## IoT / Embedded — Currently Exploring

Optional smaller category:

* ESP32
* Arduino
* I2C
* Wi-Fi-connected embedded applications

Do not position embedded development as a primary specialization yet.

---

# 14. Remove Generic Strength Section

The existing dedicated:

```text
Strengths
Growth Areas
```

section should be removed or dramatically reduced.

A professional developer portfolio should demonstrate these through:

* projects
* production work
* leadership
* deployment experience
* achievements

instead of listing generic qualities.

---

# 15. Homepage Information Architecture

Recommended homepage order:

```text
Navbar
Hero
Selected / Featured Work
Current Experience
Technical Capabilities
About
Education
Achievements
Leadership
GitHub / Open Source
Contact
Footer
```

Projects must appear higher than they do in the old website.

The visitor should see real work quickly.

---

# 16. Navigation

Recommended navigation:

```text
Home
Work
Experience
Skills
About
Contact
```

Avoid too many navigation items.

Mobile navigation must remain accessible.

---

# 17. Project Case Study Pages

Create individual static project pages using Next.js dynamic routes.

Example:

```text
/projects/kandu
/projects/greenpoint
/projects/time-capsule
/projects/ytmusic-esp32
```

Use:

```text
app/projects/[slug]/page.tsx
```

and:

```text
generateStaticParams()
```

so the pages remain compatible with static export.

Each project should support:

* title
* subtitle
* status
* role
* project summary
* problem
* solution
* responsibilities
* technical challenges
* stack
* screenshots
* external links
* repository link when public
* production link
* beta link when applicable

Store this content in typed data rather than hardcoding JSX.

---

# 18. Next.js Architecture

Use:

* Next.js App Router
* TypeScript
* Tailwind CSS
* React Server Components by default

Only use `"use client"` where interaction requires it.

Examples:

* mobile navbar
* theme switcher
* project filtering
* small animation behavior

Avoid turning the entire homepage into a client component.

---

# 19. Recommended Project Structure

```text
/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── not-found.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   └── projects/
│       └── [slug]/
│           └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── FeaturedProjects.tsx
│   │   ├── Experience.tsx
│   │   ├── Skills.tsx
│   │   ├── About.tsx
│   │   ├── Education.tsx
│   │   ├── Achievements.tsx
│   │   ├── Leadership.tsx
│   │   └── Contact.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── ProjectCard.tsx
│       ├── Badge.tsx
│       ├── SectionHeading.tsx
│       └── ThemeToggle.tsx
│
├── data/
│   ├── profile.ts
│   ├── skills.ts
│   ├── experience.ts
│   ├── projects.ts
│   ├── education.ts
│   └── achievements.ts
│
├── lib/
│   ├── types.ts
│   └── constants.ts
│
├── public/
│   ├── images/
│   │   ├── profile.jpg
│   │   └── projects/
│   ├── cv/
│   │   └── aditya-fadni-athaullah-cv.pdf
│   └── .nojekyll
│
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
│
├── next.config.ts
├── package.json
├── tsconfig.json
├── eslint.config.*
└── README.md
```

Do not create unnecessary abstraction layers.

This is a portfolio, not an enterprise SaaS application.

---

# 20. Content Data Architecture

All frequently updated portfolio content should live in `data/`.

Example TypeScript model:

```ts
export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  role?: string;
  status: "production" | "completed" | "in-progress";
  featured: boolean;
  technologies: string[];
  responsibilities?: string[];
  highlights?: string[];
  image?: string;
  github?: string;
  production?: string;
  beta?: string;
};
```

The UI should consume this data.

Do not hardcode separate project cards directly in JSX.

---

# 21. Visual Direction

The website should remain modern and clean.

Target style:

* professional
* minimal
* slightly technical
* spacious typography
* strong visual hierarchy
* white/light neutral primary palette
* polished dark mode
* subtle borders
* restrained shadows
* subtle accent color

Preserve some character from the current portfolio instead of replacing it with a generic template.

---

## Avoid

Do NOT produce a stereotypical AI-generated developer portfolio.

Avoid:

* excessive gradients
* purple neon everywhere
* glowing blobs
* glassmorphism on every component
* floating tech icons
* giant animated background particles
* excessive typing animations
* emojis as professional icons
* stock Unsplash developer photos
* unnecessary carousel components
* random counters
* meaningless progress bars
* excessive animations

Use SVG icons such as Lucide when icons are necessary.

Animations should support the interface, not dominate it.

---

# 22. Project Images

Use real screenshots whenever possible.

Reuse:

```text
src/img/projects/greenpoint-postgresql.png
src/img/projects/greenpoint-mysql.png
```

during migration.

Move appropriate assets into:

```text
public/images/projects/
```

For KandU, prefer actual screenshots of:

* campus.kandu.kr
* beta.kandu.kr

Do not generate fake screenshots.

If actual screenshots are not available during implementation, create the card without a screenshot and leave a clear asset TODO.

Never use unrelated stock photography as a project screenshot.

---

# 23. Theme

Preserve light and dark modes.

Implementation requirements:

* CSS variables
* system-conscious design
* user preference persisted in `localStorage`
* accessible theme toggle
* no hydration flash where reasonably avoidable

A large third-party theme library is not required.

---

# 24. Responsive Design

Support at minimum:

* mobile: 360px+
* tablet
* laptop
* desktop
* large desktop

The design should remain usable around:

```text
360
390
768
1024
1280
1440
```

pixels.

Avoid layouts that only look correct at desktop width.

---

# 25. Accessibility

Requirements:

* semantic HTML
* one logical H1
* heading hierarchy
* keyboard accessible navigation
* visible focus states
* meaningful alt text
* decorative graphics use empty alt text
* theme toggle has accessible labels
* mobile menu uses correct ARIA state
* sufficient color contrast
* respect `prefers-reduced-motion`

Target Lighthouse accessibility score:

```text
>= 95
```

---

# 26. SEO

Use the Next.js Metadata API.

Provide:

* title
* description
* canonical URL
* OpenGraph metadata
* Twitter metadata
* favicon
* sitemap
* robots
* Person JSON-LD

Suggested title:

```text
Aditya Fadni Athaullah | Software Developer Portfolio
```

Suggested description:

```text
Portfolio of Aditya Fadni Athaullah, an Informatics Engineering student and software developer working with Next.js, backend systems, Firebase, cloud infrastructure, networking, and production web applications.
```

Update JSON-LD `knowsAbout` with relevant current technologies.

Do not keyword-stuff.

---

# 27. GitHub Integration

The current portfolio attempts to display live GitHub statistics.

Do not make the portfolio dependent on unauthenticated GitHub API requests.

GitHub API rate limits should never break the page.

Preferred approach:

* show curated project repositories from local data
* provide a GitHub profile CTA
* optionally show static repository metadata only if implementation remains reliable

Do not build the portfolio around follower counts.

---

# 28. Contact

Keep contact simple.

Provide:

* email
* GitHub
* LinkedIn

Reuse existing verified profile links.

Primary CTA examples:

```text
View My Work
Contact Me
Download CV
```

A server-side contact form is NOT required because the initial deployment is static GitHub Pages.

Do not add a backend just for a portfolio contact form.

---

# 29. CV

Preserve the existing downloadable CV asset.

Move it into:

```text
public/cv/
```

The button must continue to work after deployment under the `/portfolio` GitHub Pages base path.

---

# 30. GitHub Pages Deployment

The portfolio should continue working at:

```text
https://cl4y0101.github.io/portfolio/
```

Use Next.js static export.

Configure Next.js appropriately for GitHub Pages.

Requirements:

* static output
* correct repository base path
* static-compatible images
* no runtime server requirement
* no server actions
* no server-only API routes
* no dynamic routes without static params

Use GitHub Actions for deployment.

Expected build output:

```text
out/
```

Create:

```text
.github/workflows/deploy-pages.yml
```

The workflow should roughly perform:

```text
checkout
setup Node.js
npm ci
npm run build
upload Pages artifact
deploy Pages
```

Do not commit `out/` manually unless absolutely necessary.

The README should explain that GitHub Pages repository settings must use **GitHub Actions** as the deployment source.

---

# 31. Development Scripts

Provide at minimum:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "...",
    "typecheck": "tsc --noEmit"
  }
}
```

Use npm.

The project must pass:

```bash
npm install
npm run lint
npm run typecheck
npm run build
```

before implementation is considered complete.

---

# 32. Performance

Avoid unnecessary JavaScript.

Requirements:

* server components by default
* lazy load secondary images
* optimized local assets
* minimal client components
* avoid huge animation libraries unless genuinely necessary
* avoid loading an entire icon library bundle
* use `next/font`

Target Lighthouse performance:

```text
>= 90 mobile
>= 95 desktop
```

where realistically possible.

---

# 33. Migration Requirements

Do not simply embed the old HTML inside React.

The old files should be properly decomposed.

Mapping:

```text
index.html
→ React/Next.js section components

style.css
→ Tailwind + globals.css + CSS variables

script.js projectData
→ data/projects.ts

script.js DOM interaction
→ React state/components

theme JavaScript
→ ThemeToggle client component

project filter logic
→ React client component

hardcoded SEO
→ Next.js Metadata API
```

After migration is confirmed successful:

* remove obsolete `index.html`
* remove obsolete `style.css`
* remove obsolete `script.js`

Do not keep duplicate legacy code in production.

---

# 34. Content Quality Rules

All portfolio copy must sound human and professional.

Avoid phrases such as:

```text
passionate developer
cutting-edge technologies
innovative solutions
dynamic individual
highly motivated
transforming ideas into reality
```

unless the wording is genuinely justified.

Prefer factual language.

Example:

Bad:

```text
A passionate developer dedicated to creating innovative cutting-edge digital experiences.
```

Good:

```text
I build and maintain web applications across Next.js, backend systems, Firebase, and Linux deployment environments.
```

Evidence over adjectives.

---

# 35. Information That Must NOT Be Published

Do not add:

* exact home address
* private phone numbers unless already intentionally public
* date of birth
* student identification numbers
* server IP addresses
* passwords
* API secrets
* Firebase secret credentials
* `.env` values
* SMTP credentials
* internal KandU credentials
* private repository links
* internal company documentation

---

# 36. Codex Implementation Process

Codex should execute the migration in phases.

## Phase 1 — Audit

Before editing:

1. inspect the full repository
2. inspect existing assets
3. inspect current `index.html`
4. inspect current `style.css`
5. inspect current `script.js`
6. inspect current CV asset
7. run `git status`
8. preserve any unrelated user changes

Do not immediately delete old code.

---

## Phase 2 — Next.js Scaffold

Convert the current repository root into the Next.js application.

Do NOT create:

```text
portfolio-next/
```

inside the repository.

The repository itself is the application.

Install only necessary dependencies.

---

## Phase 3 — Asset Migration

Move reusable assets into `public/`.

Preserve:

* profile image
* CV
* real GreenPoint screenshots

Remove reliance on stock project images.

---

## Phase 4 — Data Layer

Create typed data files for:

* profile
* experience
* projects
* skills
* achievements
* education
* leadership

UI components must render from these data files.

---

## Phase 5 — UI Migration

Recreate and improve:

* navbar
* hero
* project cards
* experience
* skills
* achievements
* contact
* footer
* dark mode
* responsive behavior

Maintain the strongest visual qualities of the old design.

---

## Phase 6 — Professional Content Update

Apply the content corrections and additions in this PRD.

Highest priorities:

1. KandU
2. GreenPoint
3. actual production/deployment skills
4. education
5. EPT achievement
6. updated current technology stack

Remove obsolete or misleading information.

---

## Phase 7 — Project Case Studies

Implement static project routes.

Featured order:

```text
KandU
GreenPoint
Time Capsule
other verified projects
```

Do not display empty placeholder projects.

---

## Phase 8 — Deployment

Configure static export and GitHub Pages.

Verify all paths work with:

```text
/portfolio/
```

especially:

* `_next` assets
* images
* CV download
* navigation
* project pages

---

## Phase 9 — Validation

Run:

```bash
npm run lint
npm run typecheck
npm run build
```

Fix all errors.

Check:

* desktop
* mobile
* light mode
* dark mode
* navigation
* external links
* CV download
* project routes
* GitHub Pages base path

---

# 37. Acceptance Criteria

The project is complete only when all of the following are true.

### Architecture

* [ ] Next.js App Router is used
* [ ] TypeScript is enabled
* [ ] Tailwind CSS is configured
* [ ] reusable components exist
* [ ] portfolio data is separated from UI components
* [ ] no giant monolithic page component

### Content

* [ ] KandU appears as primary professional work
* [ ] `campus.kandu.kr` is linked
* [ ] `beta.kandu.kr` is linked
* [ ] GreenPoint is one consolidated project
* [ ] obsolete PT Digital Komunika Nusantara experience is removed
* [ ] Kominfo description is corrected
* [ ] Politeknik Negeri Jember information is updated
* [ ] GPA 3.85 is displayed appropriately
* [ ] EPT Rank #1 / 148 out of 150 is included
* [ ] current Next.js/cloud/deployment skills are represented
* [ ] no fake skill percentages
* [ ] no placeholder project cards

### Design

* [ ] looks professional
* [ ] does not look like a generic AI-generated portfolio
* [ ] responsive
* [ ] accessible
* [ ] light/dark mode works
* [ ] real screenshots are preferred
* [ ] no unnecessary emojis
* [ ] no excessive visual effects

### Deployment

* [ ] `npm run build` succeeds
* [ ] static export succeeds
* [ ] GitHub Pages workflow exists
* [ ] `/portfolio` base path works
* [ ] assets load correctly
* [ ] project detail routes work
* [ ] CV download works

---

# 38. Definition of Done

At completion, Codex must provide a concise report containing:

1. files created
2. files removed
3. major architectural changes
4. content changes
5. new projects added
6. migration decisions
7. validation commands executed
8. build result
9. any remaining TODO items
10. any information that could not be verified

Do not claim something works if it was not tested.

Do not fabricate missing personal information.

When information is uncertain, leave a clearly named TODO rather than inventing a fact.

---

# 39. Final Instruction to Codex

Implement this PRD end-to-end.

Do not stop after scaffolding Next.js.

Do not only provide suggestions.

Make the actual changes in the repository.

Preserve useful existing assets and the recognizable identity of the current portfolio while substantially improving architecture, content accuracy, professionalism, maintainability, accessibility, and deployment.

Before considering the task complete:

```bash
npm run lint
npm run typecheck
npm run build


```

must pass.

Do not push to GitHub automatically unless explicitly instructed.

At the end, show the final `git diff --stat`, summarize the implementation, and list any manual actions still required.
