# UX storytelling V3 — implementation notes

## Architecture and choreography

The existing Next.js static-export architecture, metadata, JSON-LD, project schema,
routes, bilingual content, CV links, command palette and dialogs are retained.
No runtime or development dependencies were added.

- `components/motion/scroll-progress.ts`: one passive narrative scroll listener,
  shared IntersectionObserver activation and event-driven requestAnimationFrame batching.
  Geometry is read for all active scenes before scene callbacks write styles.
- `components/motion/useScrollProgress.ts`: reusable bounded 0–1 progress in a ref;
  continuous progress does not cause React renders. Scene changes update React state.
- `app/narrative.css`, `components/motion/motion.ts`: semantic enter, exit, focus,
  world and story timing alongside the existing motion tokens.
- `lib/preferences.ts`, `MotionProvider.tsx`, `OptionsPanel.tsx`, `app/layout.tsx`:
  explicit Off option; OS reduced-motion overrides a saved Full preference before
  hydration and when the OS preference changes.

The new flow is Menu → world entry → Spawn → Discover Builds → four project
quests → Journey → Inventory → Achievements → Profile → public code → End Portal.

Scroll-driven: bounded hero depth, project stack/spread and quest selection,
journey nodes, and case-study reading progress. Event-driven: menu entry, route
feedback, inventory inspection, filters and dialogs. Milestones use one-shot
intersection feedback without recurring screen-reader announcements.

## Important files

| Area | Files |
| --- | --- |
| Entry and spawn | `components/game-menu/MainMenuScreen.tsx`, `components/motion/HeroMotion.tsx`, `components/sections/Hero.tsx` |
| Project narrative | `components/projects/ProjectStackSpread.tsx`, `ProjectStoryPanel.tsx`, `project-stack-spread.module.css` |
| Browsing continuity | `components/sections/FeaturedProjects.tsx`, `project-journal.module.css`, `components/layout/Navbar.tsx` |
| Journey | `components/experience/ExperienceTimeline.tsx`, `experience-story.module.css`, `components/sections/Experience.tsx` |
| Inventory | `components/skills/CapabilityExplorer.tsx`, `components/sections/Skills.tsx` |
| Milestones and profile | `components/motion/Milestone.tsx`, `components/sections/Achievements.tsx`, `About.tsx`, `app/page.tsx`, `lib/translations.ts` |
| Ending and routes | `components/sections/Contact.tsx`, `components/game-menu/WorldActions.tsx`, `components/motion/PageTransition.tsx`, `components/ui/ReadingProgress.tsx` |
| Regression checks | `scripts/check-narrative.mjs`, updated selectors in `scripts/check-bilingual-motion.mjs` |

## Motion and accessibility policy

- Full cinematic storytelling requires a fine pointer, viewport above 1000×800,
  non-Low graphics and no OS motion reduction. Project and experience tracks are
  capped at 280vh and 250vh, respectively. No wheel interception or scroll-jacking.
- Mobile, coarse pointers, short viewports, Low graphics, Reduced, Minimal and Off
  present every project quest and experience as ordinary document content. The
  gallery is a separate explicit browsing action on every viewport.
- First entry is 1050ms on supported full-motion desktops; simplified entry and
  menu re-entry take 140ms, Off has no intentional delay. Re-entry preserves page
  position and restores the invoking control's focus.
- Keyboard controls can select quests and journey nodes directly. Focused story
  content is not hidden during scroll. Inventory details work with hover, focus,
  or native tap/click disclosure and link only to existing project evidence.
- Dialog focus traps, Escape/outside close, focus restoration, filter aria-live,
  language-specific CVs and native browser history remain in place.
- Navigation uses Next.js links without intercepting or delaying route changes;
  route imagery reuses the destination's real cover. A DOM shared-cover transition
  moves a visible preview into the case-study cover using the Web Animations API,
  without intercepting Next.js navigation. Direct entry, history traversal and
  unsupported/reduced devices retain the portal/static fallback.

## Verification

Run `npm run lint`, `npm run typecheck`, and `npm run build` sequentially when
validating the final export. Build and typecheck must not run concurrently because
Next regenerates `.next/types`.

Browser suite (Node 22+ with built-in WebSocket, headless Chrome on port 9229):

```text
py -m http.server 3031 -d out
node scripts/check-narrative.mjs
node scripts/check-narrative.mjs https://cl4y0101.github.io/portfolio/
```

The suite checks world entry, keyboard/focus restoration, all four quest states,
desktop 1440×1000 and 1024×820 Indonesian story fit, journey progression,
inventory evidence, filter/live region, quick-view focus/Escape/outside close,
command palette, direct URLs, browser back/forward and gallery context,
Reduced/Minimal/Off/Low and OS override, mobile 390×844, both languages/CVs,
theme switching, light text colors, and browser runtime/network console errors.
Screenshots are generated in the OS temp directory for visual review.

## Tradeoffs and remaining checks

- Desktop sticky scenes intentionally fall back on short windows and zoomed
  layouts, avoiding clipped story text. Static fallback is longer but contains
  all the same information.
- Existing project/experience copy and factual dates are reused. Missing dates
  and unsupported skill/project associations are not invented.
- Category worlds now use scoped terrain/grid/signal/workshop geometry and subtle
  neutral accents in `lib/project-world.ts` and `app/world-polish.css`. Six CSS
  particles run once, pause offscreen/when the document is hidden, and disappear
  on mobile, coarse pointers, Low graphics and reduced-motion settings.
- `WorldAtmosphere.tsx` owns the visibility lifecycle; `useSharedProjectCover.ts`
  owns the temporary cover clone, timeout and cancellation lifecycle. Resize,
  policy changes and rapid route changes clean up without changing history.
- Cross-browser checks are in `scripts/check-world-polish.mjs`. Playwright and
  axe-core are installed only in an external temporary QA directory, not in the
  portfolio dependencies. The suite covers Chromium, Firefox, WebKit, touch-input
  emulation, accessibility-tree names, and axe WCAG A/AA checks on menu, quests,
  quick view, case study, light homepage and Indonesian reduced-motion mobile.
- The accessibility checks identified and prompted fixes for light-theme muted
  text contrast and the mobile avatar link's accessible name.
- WebKit testing is not equivalent to Safari on a real Apple device. Physical
  touch devices and an actual NVDA/VoiceOver reading audit remain manual checks;
  automated accessibility results cannot certify complete WCAG compliance.
- Local OneDrive cache locks and transient Google Fonts fetch failures occurred
  during validation. Cache folders were preserved in OS temp backups; the build
  succeeded on retry without changes to production configuration or fonts.
