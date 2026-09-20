# Visual source audit and integration

The existing Next.js repository is the portfolio source. `portfolio-main.zip`
was not present in the supplied workspace. No routes or content were replaced.

## Source inventory

| Archive | Audited contents | Used | Excluded |
| --- | --- | --- | --- |
| Minecraft-CSS-main.zip | Source components, base tokens, compiled distribution, fonts, license | Button bevels, inset depth, border and spacing patterns, panel/HUD/card/modal surfaces | Global reset, typography, generic selectors, compiled bundle, game fonts, build tooling |
| liquid-glass-main.zip | JavaScript effect, README, demo, MIT license | Bounded TypeScript adaptation of the displacement-map technique and scoped glass material | Global window API, demo images, three-channel chromatic split, draggable demo |
| mcicons-main.zip | PNG inventory, mcicons.css, README, Composer metadata | 10 PNGs (10,445 bytes) and a prefixed, local CSS subset | Unused icons, CDN URLs, PHP service provider, Composer vendor files |

Input SHA-256 fingerprints (recorded before ZIP cleanup):

- Minecraft-CSS: `4782042925D56855B2D0A26B63AA18192C409A29FCA8D669D1507AEA451381DA`
- liquid-glass: `F192F7F414739F24689B109DF43C5D9988F8DC4C0724A69F339604EBC66AAA1C`
- mcicons: `F284E9DBCBF3BC191E8EC2CC3573098440754E6EDC20C485DFE5A0C55C824FC9`

## Ownership and scope

- `components/game-ui/minecraft.module.css` contains the adapted Minecraft-CSS
  foundation. CSS Modules scope every component class. It is applied explicitly
  to menu buttons/panels, option controls, achievement slots, HUD links, project
  cards, quick view and command palette. Existing global styles are not modified.
- `components/game-ui/GlassPanel.tsx` owns effect setup and teardown. It wraps
  menu panels only; it does not make portfolio content client-only.
- `lib/liquid-glass.ts` evaluates browser APIs only when called after mount.
  It creates a maximum 384px displacement map on mount or debounced resize,
  uses one SVG displacement pass, and removes its SVG, styles, timer and
  observer when disabled or unmounted. There is no perpetual canvas/WebGL loop.
- High graphics enables refraction only for visible, fine-pointer desktops
  with Full motion and supported Chromium backdrops. Panels larger than 800px
  in either dimension use frosted fallback. Balanced uses CSS blur. Low,
  Minimal/Off, mobile and OS reduced-motion use an opaque or nearly opaque
  surface. Safari/Firefox use the CSS fallback.
- `public/vendor/mcicons/mcicons.css` is a local subset with `.mc-ui-*`
  selectors and relative image URLs. The stylesheet link uses `withBasePath`,
  so both `/` development and `/portfolio/` Pages deployment work.

## Icons

```tsx
<GameIcon name="diamond" alt="Featured project" size="xl" />
<GameIcon name="compass" /> // Decorative beside an existing accessible label
```

Supported sizes are `sm` (16px), `md` (24px), `xl` (32px), and `2xl` (40px).
Dimensions are reserved before images load. A meaningful `alt` supplies
`role="img"` and an accessible name; empty `alt` hides the decorative icon.

| Name | Current use |
| --- | --- |
| diamond | Start / enter portfolio |
| crafting-table | Options |
| nether-star | Achievements and milestones |
| book | About |
| arrow | Back |
| oak-door | Exit menu |
| compass | Reset preferences and HUD portfolio navigation |
| emerald | Leadership milestone |
| redstone | IoT project category |
| chest | Other project categories |

Icons are illustrative and do not replace text labels, technology names or
professional content. The supplied mcicons PNGs are included following the
explicit latest request to use that archive. They are not described as original
portfolio artwork. No Minecraft fonts, logos, sounds or texture packs are added.

## Attribution

- [Jiyath5516F/Minecraft-CSS](https://github.com/Jiyath5516F/Minecraft-CSS):
  supplied MPL-2.0 text retained at `public/vendor/Minecraft-CSS/LICENSE`.
  The adapted CSS module remains available in this repository as source.
- [deepika-builds/liquid-glass](https://github.com/deepika-builds/liquid-glass):
  copyright (c) 2026 Deepika Rao, supplied MIT license retained at
  `public/vendor/liquid-glass/LICENSE`.
- [themuhamed/mcicons](https://github.com/themuhamed/mcicons): the archive's
  README and Composer metadata declare MIT. It contains no project-root LICENSE;
  the upstream README is retained at `public/vendor/mcicons/README.upstream.md`.
  The unrelated Composer ClassLoader license is not presented as an asset license.

No package dependencies were added. Source ZIPs are removed after successful
validation; the necessary assets, adaptations and notices remain in Git.
