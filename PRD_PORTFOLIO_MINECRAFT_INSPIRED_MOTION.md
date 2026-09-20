# Product Requirements Document

## Minecraft-Inspired Motion System for Aditya Fadni Athaullah Portfolio

**Document status:** Ready for implementation
**Target repository:** `portfolio-main`
**Application:** Next.js 16.3.3 + React 19.2.8 + TypeScript + Tailwind/PostCSS + custom CSS
**Primary goal:** Transform the existing professional portfolio into an interactive, Minecraft-inspired portfolio experience without turning it into a game clone or damaging readability, performance, accessibility, SEO, or professional credibility.

---

## 1. Executive Summary

The current portfolio already has a solid information architecture and a useful component/data separation. It includes:

- a homepage with Hero, selected work, experience, skills, about, achievements, open source, and contact sections;
- project case-study routes at `/projects/[slug]`;
- project filtering and quick view dialogs;
- a command palette;
- theme switching;
- an existing `ScrollReveal` implementation;
- responsive layout, metadata, sitemap, robots, JSON-LD, and downloadable CV support.

The problem is not lack of features. The current interaction language is still mostly conventional portfolio UI: fade/slide reveals, static cards, standard buttons, and ordinary route changes. The requested change is to give the site a distinctive visual and motion identity inspired by Minecraft Bedrock/Java Edition: world loading, block/grid geometry, HUD-like navigation, camera movement, chunk-like section reveals, inventory-inspired project browsing, and satisfying page transitions.

The implementation must preserve the portfolio's primary job: make Aditya look credible as a software developer. The Minecraft reference should influence motion, composition, geometry, and interaction metaphors—not replace professional content with decorative game UI.

### Product principle

> A professional developer portfolio presented as an explorable digital world: playful in interaction, serious in evidence.

---

## 2. Current Repository Audit

### 2.1 Existing architecture

Relevant current files and components:

| Area | Current implementation | Implication |
|---|---|---|
| App shell | `app/layout.tsx` | Best place for global motion provider, page transition shell, theme, and loading state. |
| Homepage | `app/page.tsx` | Existing section order should remain unless a later design decision explicitly changes it. |
| Case studies | `app/projects/[slug]/page.tsx` | Needs route entrance/exit, hero image treatment, section progress, and project-to-project transitions. |
| Global styling | `app/globals.css` | Existing CSS system can absorb motion tokens and Minecraft-inspired surfaces. |
| Navigation | `components/layout/Navbar.tsx` | Good foundation for HUD-like navigation, command palette, and active-section indicator. |
| Hero | `components/sections/Hero.tsx` | Main opportunity for world-loading entrance, cursor/parallax depth, and avatar frame treatment. |
| Project browsing | `FeaturedProjects.tsx`, `ProjectCard.tsx`, `ProjectQuickView.tsx` | Best place for inventory/chunk metaphors and filter transition choreography. |
| Existing scroll motion | `components/ui/ScrollReveal.tsx` | Must be expanded, not duplicated. |
| Existing dialog | `components/ui/Dialog.tsx` | Can become a block-placement/modal transition with preserved focus management. |
| Data | `data/*.ts` | Keep content data-driven; do not hard-code visual logic into project data. |
| Icons | `lucide-react` | Continue using these for clarity; do not replace every icon with pixel art. |

### 2.2 Current strengths to preserve

- The project content is separated from rendering components.
- The site already communicates professional work, production status, technologies, and contribution.
- Case studies have meaningful sections: overview, contribution, technology, challenges, results.
- The existing `prefers-reduced-motion` behavior is a good baseline.
- The site already includes keyboard-oriented interactions through the command palette and dialogs.
- SEO and accessibility foundations already exist and must not regress.

### 2.3 Current gaps to address

- No coordinated page transition system exists between `/` and `/projects/[slug]`.
- Existing scroll reveal is primarily an on/off visibility mechanism, not a full motion language.
- Project filter changes do not have a distinct world/chunk transition.
- The hero does not communicate a strong personal visual identity beyond typography and portrait.
- Navbar is functional but not yet a recognizable HUD.
- Project cards are useful but visually conventional.
- There is no shared animation token layer for duration, easing, stagger, depth, or intensity.
- There is no centralized policy for reduced motion, low-power devices, or mobile motion budgets.

---

## 3. Goals and Non-Goals

### 3.1 Goals

1. Create a recognizably Minecraft-inspired interaction system.
2. Make scrolling feel like moving through a world/chunks rather than reading disconnected sections.
3. Make project cards and case studies feel tactile and discoverable.
4. Add elegant route transitions between homepage and project pages.
5. Keep the site professional enough for recruiters, clients, technical leads, and teammates.
6. Preserve current content, routes, SEO, keyboard access, and responsive behavior.
7. Ensure animations remain smooth on ordinary laptops and mobile devices.
8. Make the motion system reusable rather than implementing one-off animations in every component.

### 3.2 Non-goals

- Do not build a full 3D Minecraft game.
- Do not add a WebGL/Three.js scene unless a measured prototype proves it is necessary and performant.
- Do not copy Minecraft textures, sounds, logos, UI assets, fonts, or proprietary visual files.
- Do not add background music or sound effects by default.
- Do not hide professional information behind confusing game mechanics.
- Do not replace semantic HTML with canvas-only UI.
- Do not rewrite the existing data architecture unless required by the animation implementation.
- Do not sacrifice load performance for visual spectacle.

---

## 4. Creative Direction

### 4.1 Desired feeling

The visitor should feel that the portfolio is a small, polished digital world that loads, reveals its terrain, and lets them inspect the creator's work. The experience should feel:

- structured rather than chaotic;
- tactile rather than gimmicky;
- exploratory but immediately understandable;
- pixel-aware but not childish;
- cinematic at key moments but restrained during reading;
- inspired by Minecraft's world-building language, not visually copied from the game.

### 4.2 Visual vocabulary

Use the following vocabulary selectively:

- block/grid geometry;
- layered panels resembling HUD cards;
- subtle pixel stepping in borders, masks, and transitions;
- world-loading and chunk-generation metaphors;
- inventory-like project selection;
- biome-like color accents for content categories;
- depth through shadows, parallax, scale, and z-order;
- crosshair/selection states for focus and hover;
- map coordinates or section labels used as editorial decoration;
- low-frequency ambient movement such as floating particles or slow cloud layers.

Avoid:

- fake Minecraft buttons copied from the game;
- excessive dirt/grass textures;
- pixel font for body text;
- random bouncing on every element;
- endless particle effects;
- forced sound;
- visual noise behind long-form case-study text;
- interactions that require the visitor to guess what to click.

### 4.3 Color direction

Keep the current light/dark theme support. Introduce a restrained token layer:

- stone/graphite neutral surfaces for UI framing;
- grass/leaf green for active or production states;
- sky blue for links and navigation;
- amber/gold for achievements and highlighted evidence;
- red only for errors or destructive states;
- warm off-white and deep charcoal for readable text.

Colors must work in both themes and pass WCAG AA for normal text. The palette must not depend on a background screenshot or texture for contrast.

### 4.4 Typography

- Keep a highly readable sans-serif for body text.
- Keep the monospace font for technical labels, coordinates, metadata, command palette hints, and code-like fragments.
- If a pixel/display font is introduced, use it only for small decorative labels or loading states.
- Never use a pixel font for paragraphs, navigation labels, case-study content, or buttons that users must scan quickly.

---

## 5. Experience Model

### 5.1 Homepage as a world journey

The homepage remains a vertical page. Its sections become “zones” or “chunks” in a continuous world journey:

1. **Spawn / Hero** — personal identity and current focus.
2. **Build Gallery / Selected Work** — projects as inspectable blocks.
3. **Timeline Path / Experience** — career and contribution progression.
4. **Skill Tree / Skills** — capability groups and technologies.
5. **Player Profile / About** — education, working style, and context.
6. **Achievements** — verified milestones and certifications.
7. **Open Source / Repositories** — public evidence.
8. **Beacon / Contact** — clear call to connect.

The existing headings and content remain explicit. The metaphors are visual wrappers, not replacements for accessible labels.

### 5.2 Case study as a focused world instance

Each project page should feel like entering a dedicated world/region:

- short loading/transition sequence;
- project title and status appear first;
- cover image behaves like a framed portal or map surface;
- sections reveal as the reader moves through the project;
- technology explorer feels like inspecting an inventory or crafting grid;
- next-project CTA feels like moving to another region.

The page must still read like a case study when all animation is disabled.

---

## 6. Functional Requirements

### FR-01: Global motion preference

Implement a single motion policy used by every animated component.

Required modes:

- `full`: normal experience;
- `reduced`: respect `prefers-reduced-motion: reduce`;
- `off`: optional developer/debug mode for testing.

When reduced motion is active:

- remove parallax, large transforms, spinning, and particle movement;
- keep short opacity changes and instant state changes where useful;
- never hide content because an animation did not run;
- preserve focus and dialog behavior.

### FR-02: Central animation tokens

Create a shared token layer in CSS variables and/or a TypeScript motion constants module. At minimum define:

- duration: instant, fast, base, reveal, page;
- easing: standard, emphasized, enter, exit, spring-like;
- stagger step and maximum stagger count;
- transform distances for small, medium, and large movement;
- shadow/depth levels;
- motion intensity by breakpoint.

Do not scatter arbitrary transition values throughout components.

Suggested starting values:

```css
--motion-fast: 140ms;
--motion-base: 220ms;
--motion-reveal: 520ms;
--motion-page: 680ms;
--motion-stagger: 55ms;
--motion-distance-sm: 10px;
--motion-distance-md: 20px;
--motion-distance-lg: 34px;
```

These values are starting points, not a reason to animate everything for 680ms.

### FR-03: Initial world-load entrance

On first visit to the homepage, implement a restrained entrance sequence:

1. shell/background becomes visible;
2. navigation HUD enters from a short vertical offset;
3. hero content reveals in a deliberate stagger;
4. portrait/frame settles with a subtle block-like scale or clip reveal;
5. below-the-fold content remains available immediately and is not blocked by a full-screen loader.

Constraints:

- no mandatory wait longer than 900ms;
- do not show a fake loading percentage unless it represents real work;
- do not prevent keyboard users from reaching content during the entrance;
- repeat only when the page is genuinely reloaded, not on every anchor navigation.

### FR-04: HUD-like navbar

Enhance `Navbar.tsx` with:

- a compact “world/status” accent or coordinate label;
- active-section indicator that feels like a selected hotbar slot or crosshair;
- subtle border/light response on scroll;
- mobile menu opening as a panel/chunk deployment, not a generic instant dropdown;
- command palette trigger styled as a command/input slot while retaining the existing keyboard hint;
- theme toggle styled as a day/night world state control.

The navbar remains a normal semantic `<nav>` and must be fully keyboard accessible.

### FR-05: Hero interaction

Enhance `Hero.tsx` with:

- a layered world/terrain background using CSS gradients, shapes, or existing assets;
- subtle pointer parallax on desktop only, capped to a small movement range;
- avatar frame with an intentional pixel/block mask or stepped border;
- focus card that enters as a “current quest/current build” panel;
- button hover/focus states resembling selected blocks or item slots;
- optional tiny ambient motion, disabled under reduced motion and low-power mode.

The hero must remain readable without background animation and must not rely on pointer movement for meaning.

### FR-06: Scroll-driven section reveals

Extend `ScrollReveal.tsx` or replace it with a reusable motion system that supports:

- fade + vertical reveal for ordinary content;
- clip-path/block wipe for section headings;
- staggered item placement for cards, timeline entries, skills, and achievements;
- controlled image scale/translate on entry;
- optional scroll-linked progress or depth only where it improves orientation.

Do not animate every descendant. Use a small number of intentional reveal groups per section.

Required behavior:

- reveal once per page visit by default;
- do not cause layout shift;
- do not use scroll event handlers for every element if IntersectionObserver and CSS can do the job;
- avoid scroll-jacking and do not replace native scrolling with a custom wheel system.

### FR-07: Project gallery / inventory interaction

Enhance `FeaturedProjects.tsx` and `ProjectCard.tsx`:

- project cards should feel like selectable build blocks or inventory slots;
- hovered/focused cards lift slightly, expose depth, and show a clear selection boundary;
- the first prominent production project may have a larger “featured build” treatment;
- technology badges can behave like item tags, but remain readable text;
- project image should have a restrained depth/zoom response, capped to prevent distortion;
- filters should animate the outgoing and incoming card sets with layout-aware transitions;
- category changes must not cause a flash of empty content or inaccessible focus.

If a layout animation library is introduced, keep it small and justify it. CSS transitions plus stable keys are preferred where sufficient.

### FR-08: Filter transition

When a project category changes:

1. preserve the filter button focus;
2. announce the new result count via the existing live region;
3. animate removed cards out with a short fade/scale;
4. animate incoming cards into their new grid positions with a subtle stagger;
5. preserve or reset scroll position intentionally, without jumping unexpectedly.

If the current grid cannot support smooth layout transitions without adding fragility, use a deliberate fade-out/fade-in sequence rather than a broken pseudo-layout animation.

### FR-09: Quick-view dialog transition

Enhance the existing dialog without changing its accessibility contract:

- backdrop fades in;
- panel deploys as a framed block/panel with a short scale and translate;
- content sections stagger minimally;
- close action reverses the animation;
- focus is trapped and restored exactly as it is now;
- Escape and outside-click behavior remain intact.

Do not animate the dialog in a way that delays keyboard access.

### FR-10: Page transitions

Implement route transitions for homepage and case-study pages using a client-side transition shell compatible with the current Next.js App Router.

Desired transition language:

- outgoing page compresses/fades or is covered by a block/chunk wipe;
- a short world/portal transition masks the route change;
- incoming page reveals its hero first, then its content;
- back navigation feels coherent with forward navigation;
- anchor links within the same page must not trigger a full route transition.

Important technical constraints:

- do not break server-rendered page content, metadata, or static generation;
- do not add a router hack that prevents normal browser back/forward behavior;
- avoid holding navigation hostage to an arbitrary timer;
- use `prefers-reduced-motion` to switch to an instant or very short crossfade;
- ensure focus moves to the new page heading or main content appropriately.

### FR-11: Case-study scroll choreography

Enhance `app/projects/[slug]/page.tsx` and related components:

- case hero title, badges, and facts enter as a coordinated group;
- cover image has a framed portal/map presentation with subtle reveal;
- `CaseStudyNavigation` behaves like a compact waypoint bar;
- problem/solution cards reveal as two meaningful blocks;
- technology explorer transitions between selected technologies without excessive motion;
- challenge grid uses a controlled stagger;
- next-project CTA uses a stronger but short “portal” reveal.

### FR-12: Image and media treatment

- Use existing project screenshots and profile image; do not manufacture fake product screenshots.
- Add CSS-based framing, masks, shadows, and hover depth rather than duplicating image assets.
- Preserve `next/image`, dimensions, `sizes`, and priority decisions.
- Do not apply aggressive filters that reduce screenshot legibility.
- Avoid autoplay video unless a real asset and a clear UX reason exist.

### FR-13: Mobile adaptation

On small screens:

- remove or sharply reduce pointer parallax;
- reduce stagger counts and transform distances;
- keep cards easy to scan and tap;
- avoid horizontal overflow from HUD decorations;
- make transitions shorter and simpler;
- keep navigation and filters usable with touch;
- preserve the same content hierarchy as desktop.

### FR-14: Performance and resilience

- Prefer CSS transforms and opacity for animation.
- Do not animate layout properties continuously.
- Do not add a large animation dependency without measuring its value.
- Avoid a permanent canvas/WebGL loop.
- Pause or remove ambient effects when the tab is hidden where applicable.
- Keep initial JavaScript and image cost within the existing performance budget.
- Verify no hydration mismatch is introduced by theme or motion detection.

---

## 7. Suggested Implementation Architecture

### 7.1 Recommended reusable primitives

Add only the primitives that are genuinely reused:

```text
components/motion/
  MotionProvider.tsx
  PageTransition.tsx
  Reveal.tsx
  Stagger.tsx
  useReducedMotion.ts
  motion.ts

components/world/
  WorldBackdrop.tsx
  HudFrame.tsx
  BlockReveal.tsx
  WorldStatus.tsx
```

Names may change, but the responsibilities should remain separated.

### 7.2 Motion attributes

Use declarative attributes or small props rather than custom class combinations everywhere. Example:

```tsx
<Reveal variant="block" delay={80}>
  <SectionHeading ... />
</Reveal>
```

Supported reveal variants should be few and documented, for example:

- `fade-up`;
- `block-wipe`;
- `scale-in`;
- `stagger`;
- `portal`.

### 7.3 CSS and JS boundary

Use CSS for:

- hover/focus transitions;
- reveal transforms;
- masks, clip-path, shadows, and keyframes;
- reduced-motion overrides.

Use JavaScript only for:

- observing viewport entry;
- coordinating route transitions;
- reading pointer position for capped parallax;
- managing dialog/filter state;
- detecting visibility or motion preferences.

Do not use JavaScript to continuously set styles on every scroll tick when CSS can perform the effect.

### 7.4 Optional dependency policy

Before adding Framer Motion, Motion, GSAP, Lenis, Three.js, or another animation package, Codex must:

1. explain the exact interaction that cannot be implemented cleanly with the current stack;
2. estimate bundle/runtime impact;
3. confirm the feature works without the dependency under reduced motion;
4. avoid adding more than one major animation library without explicit approval.

The default implementation should use existing React, CSS, IntersectionObserver, and the current Next.js architecture.

---

## 8. Interaction Specifications

### 8.1 Hover and focus

Hover is enhancement only. Every hover state must have an equivalent `:focus-visible` state.

Target behavior:

- card: small lift, shadow/depth increase, image scale no more than approximately 1.03;
- button: selected block edge/light response;
- link: directional arrow or underline motion;
- nav item: active slot/crosshair indicator;
- screenshot: slight framing response, never blur the content.

### 8.2 Timing rules

- micro-interaction: 120–220ms;
- standard reveal: 350–600ms;
- page transition: 450–750ms maximum;
- no infinite loop on primary content;
- no animation longer than 1s unless it is an optional ambient background effect;
- stagger must be capped, preferably at 4–6 visible items.

### 8.3 Scroll rules

- native scroll remains in control;
- no snap scrolling for the entire page;
- no forced cinematic pause between sections;
- content is readable if the visitor scrolls quickly;
- scroll-linked effects must degrade gracefully when unsupported.

### 8.4 Accessibility rules

- semantic headings and landmarks remain unchanged;
- animated content is present in the DOM and accessible to assistive technologies;
- dialogs retain focus trap and focus restoration;
- live region announces filter result changes;
- keyboard users can navigate all interactive controls;
- contrast remains sufficient in both themes;
- reduced motion is tested manually, not only implemented in CSS;
- no information is conveyed by color or animation alone.

---

## 9. Proposed Visual Treatment by Existing Component

| Existing component | Treatment | Priority |
|---|---|---:|
| `Navbar` | HUD shell, active slot indicator, compact world status, animated mobile panel | P0 |
| `Hero` | Spawn entrance, stepped portrait frame, capped parallax, current quest card | P0 |
| `ScrollReveal` | Shared reveal variants, stagger support, reduced-motion policy | P0 |
| `ProjectCard` | Build-block surface, depth hover, image reveal, selected state | P0 |
| `FeaturedProjects` | Inventory-like filter row and layout-aware filter transition | P0 |
| `ProjectQuickView` | Block-deploy dialog entrance and exit | P1 |
| `CaseStudyNavigation` | Waypoint/coordinate bar with active section state | P1 |
| Case-study hero | Portal entry, staged title/badges/facts reveal | P0 |
| Technology explorer | Inventory/crafting-grid inspired selection states | P1 |
| Experience timeline | Path/waypoint reveal with restrained node motion | P1 |
| Skills | Skill-tree-like grouping without requiring game knowledge | P1 |
| Achievements | Badge/advancement-inspired cards, still clearly labeled as achievements | P1 |
| Footer/contact | Beacon/portal closing moment, clear CTA | P1 |

P0 items define the identity. P1 items should follow only after the core transitions are stable.

---

## 10. Content and Brand Rules

- Keep Aditya's name, role, education, experience, projects, and evidence clear above the decorative layer.
- Do not claim Minecraft affiliation, endorsement, or official visual reproduction.
- Do not use copied Minecraft textures, sounds, logos, UI screenshots, or proprietary fonts.
- Use neutral language such as “block-inspired”, “world-inspired”, or “Minecraft-inspired interaction” only in internal implementation notes—not as the primary portfolio headline.
- The visitor should understand within five seconds that this is a software developer portfolio.
- Production projects and real contribution must remain visually more important than experiments.
- Keep “professional” project status distinctions clear; playful styling must not flatten them.

---

## 11. SEO and Technical Constraints

The following must remain correct after implementation:

- static generation of project routes;
- route metadata and Open Graph images;
- canonical URLs;
- sitemap and robots;
- JSON-LD Person data;
- downloadable CV;
- semantic page headings;
- deep links to `/projects/[slug]`;
- normal browser back/forward behavior;
- no content hidden from crawlers because it waits for client-side animation.

If a client boundary is needed for transitions, keep the actual project content server-rendered wherever possible.

---

## 12. Implementation Phases

### Phase 1 — Baseline and motion foundation

- inspect current CSS and component behavior;
- add motion tokens;
- add reduced-motion policy;
- create reusable reveal primitives;
- verify current routes and content are unchanged.

### Phase 2 — Homepage identity

- implement world-load entrance;
- upgrade navbar to HUD language;
- upgrade hero frame and focus card;
- add restrained backdrop/depth layers;
- verify mobile and reduced-motion behavior.

### Phase 3 — Projects interaction

- upgrade project cards;
- implement filter transitions;
- upgrade quick-view dialog;
- preserve live-region and keyboard behavior.

### Phase 4 — Route and case-study transitions

- implement page transition shell;
- add case-study hero choreography;
- upgrade case navigation and section reveals;
- test back/forward, direct links, refresh, and reduced motion.

### Phase 5 — Secondary sections

- experience timeline/path;
- skills tree grouping;
- achievements/advancement styling;
- contact/beacon ending.

### Phase 6 — Quality and performance pass

- run lint, typecheck, and production build;
- test desktop, tablet, and mobile;
- test light/dark themes;
- test keyboard-only navigation;
- test reduced motion;
- inspect layout shift, overflow, image loading, and animation smoothness;
- remove any effect that does not improve orientation or comprehension.

---

## 13. Acceptance Criteria

### Visual and interaction

- [ ] The portfolio has a coherent block/world/HUD-inspired visual language across homepage and case-study pages.
- [ ] The visual direction is recognizably inspired by Minecraft's world-building feel without copying Minecraft assets or UI.
- [ ] Hero entrance, scroll reveals, project filter transitions, dialog transitions, and route transitions are implemented.
- [ ] Motion is coordinated through shared tokens and reusable primitives.
- [ ] Animations feel intentional and do not make the page look noisy or childish.
- [ ] Project cards clearly expose title, status, description, technologies, and actions in all states.

### UX and accessibility

- [ ] All interactive controls work with keyboard and touch.
- [ ] Every hover effect has an equivalent focus-visible state.
- [ ] Dialog focus trap, Escape close, outside-click close, and focus restoration still work.
- [ ] Filter changes preserve focus and announce updated result count.
- [ ] Native scrolling is preserved; there is no scroll-jacking.
- [ ] `prefers-reduced-motion: reduce` disables or simplifies non-essential movement.
- [ ] No content depends on animation to be discoverable or understandable.

### Responsive and performance

- [ ] No horizontal overflow at mobile widths.
- [ ] Parallax and ambient effects are reduced or removed on mobile/low-power contexts.
- [ ] Animations use transform/opacity where practical.
- [ ] No persistent high-cost canvas/WebGL loop is introduced without explicit justification.
- [ ] Existing image optimization and priority behavior remain intact.
- [ ] Production build completes successfully.

### Regression safety

- [ ] `/` loads correctly on direct visit and refresh.
- [ ] Every static `/projects/[slug]` route loads correctly on direct visit and refresh.
- [ ] Browser back/forward works after animated navigation.
- [ ] SEO metadata, canonical URLs, sitemap, robots, JSON-LD, and CV download remain present.
- [ ] Light and dark themes still work without flash or hydration warnings.
- [ ] Existing content is not rewritten or invented during the visual redesign.

---

## 14. Required Validation Commands

Run from the repository root:

```bash
npm run lint
npm run typecheck
npm run build
```

Also manually validate:

```text
Homepage first load
Homepage fast scroll
Homepage anchor navigation
Project filter changes
Quick-view open/close
Command palette open/close
Theme toggle
Direct case-study URL
Case-study back link
Browser back/forward
Keyboard-only navigation
Reduced motion enabled
Mobile viewport
Slow network / disabled cache
```

If Playwright or another browser test tool is already present in the repository, add focused smoke tests for the route transition, dialog, filter, and reduced-motion paths. Do not introduce a testing dependency solely for animation snapshots unless it is already part of the project workflow.

---

## 15. Definition of Done

The work is complete when the portfolio feels like one cohesive interactive world rather than a collection of unrelated CSS effects, while still functioning as a fast, readable, professional developer portfolio.

Codex must finish with:

1. a short summary of changed files;
2. a list of new motion primitives and their intended use;
3. confirmation that no copyrighted Minecraft assets were added;
4. results of lint, typecheck, and build;
5. a note describing reduced-motion behavior;
6. a note describing any new dependency and why it was necessary;
7. any known visual tradeoffs or remaining issues.

---

## 16. Final Instruction to Codex

Implement this PRD directly in the existing `portfolio-main` repository.

Start by auditing the current components and styles before editing. Preserve the existing content model, routes, SEO behavior, accessibility foundations, and deployment assumptions. Build the motion system first, then apply it to the hero, navbar, projects, dialogs, case studies, and secondary sections.

Use a restrained Minecraft-inspired design language: block geometry, HUD framing, chunk/world loading metaphors, inventory-like selection, portal transitions, and subtle depth. Do not make the site look like a copied Minecraft menu, do not use Minecraft assets, and do not add animation merely because it is technically possible.

When a visual effect conflicts with readability, accessibility, performance, or professional credibility, remove or simplify the effect. The final result must communicate “software developer who builds real systems” before it communicates “Minecraft-inspired portfolio.”
