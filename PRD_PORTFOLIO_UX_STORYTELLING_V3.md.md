# PRD v3 — Portfolio UX Storytelling & Motion Choreography

## 1. Product Context

Portfolio ini sudah memiliki fondasi visual dan interaction system yang cukup kuat:

* Minecraft-inspired main menu
* World background
* Liquid/glass UI
* Custom game icons
* Hero parallax
* Scroll reveal
* Word reveal
* Project stack spread
* Page transitions
* Quick view project
* Motion preferences
* Reduced-motion support
* Bilingual UI
* Responsive layout

Namun pengalaman pengguna masih terasa seperti:

```text
Minecraft Main Menu
        ↓
Traditional Portfolio Website
        ↓
Independent Animated Components
```

Masalah utamanya bukan kurangnya jumlah animasi.

Masalah utamanya adalah motion yang ada belum membentuk sebuah perjalanan atau narrative flow yang konsisten.

Target PRD ini adalah mengubah pengalaman menjadi:

```text
MAIN MENU
   ↓
WORLD LOADING
   ↓
SPAWN POINT
   ↓
DISCOVER BUILDS
   ↓
QUEST / PROJECT STORY
   ↓
PLAYER JOURNEY
   ↓
INVENTORY / SKILLS
   ↓
ACHIEVEMENTS
   ↓
PLAYER PROFILE
   ↓
END PORTAL / CONTACT
```

Minecraft tidak boleh hanya menjadi skin visual.

Minecraft harus menjadi interaction language untuk seluruh portfolio.

---

# 2. Primary Goal

Membuat portfolio terasa seperti sebuah interactive developer world yang memiliki:

* beginning
* progression
* discovery
* milestones
* climax
* ending

Setiap animasi harus memiliki fungsi:

1. menunjukkan progression,
2. menjelaskan perubahan state,
3. mengarahkan perhatian,
4. memberikan spatial continuity,
5. atau memberikan feedback terhadap aksi user.

Jangan menambahkan animasi hanya karena terlihat keren.

---

# 3. Design Principle

Gunakan urutan berikut saat membuat motion:

```text
STORY
↓
USER ACTION
↓
INTERACTION
↓
MOTION
↓
COMPONENT
```

Dilarang menggunakan pendekatan:

```text
COOL COMPONENT
↓
CARI TEMPAT
↓
TEMPEL
```

Komponen dari 21st.dev boleh digunakan sebagai building block, tetapi harus disesuaikan dengan design system existing.

Jangan membuat website terlihat seperti demo library animation.

---

# 4. Existing Architecture to Preserve

Pertahankan:

* Next.js 16 architecture
* React 19
* current routes
* project data structure
* SEO
* JSON-LD
* accessibility foundation
* bilingual system
* light/dark theme
* game preferences
* graphics quality preferences
* reduced-motion modes
* existing project case-study pages
* Cloudflare-compatible deployment
* current content

Jangan rewrite seluruh aplikasi.

Perubahan harus bersifat incremental.

---

# 5. Existing Components to Reuse

Prioritaskan reuse:

```text
MainMenuScreen
WorldBackground
GlassPanel
GameMenuButton
HeroMotion
RevealText
ScrollReveal
ProjectStackSpread
ProjectCard
ProjectQuickView
PageTransition
MotionProvider
Navbar
Footer
```

Refactor hanya jika interaction architecture baru membutuhkan perubahan.

---

# 6. Narrative Architecture

## ACT 0 — Main Menu

Current main menu dipertahankan.

Menu:

```text
ADITYA FADNI

Start Portfolio
Options
Achievements
About
Exit
```

Main menu adalah game start screen.

### Start interaction

Ketika user menekan:

```text
Start Portfolio
```

jangan langsung menghilangkan menu.

Gunakan sequence:

```text
Button press
↓
Menu UI retracts
↓
World remains visible
↓
Loading world
↓
Terrain/background gains depth
↓
Camera pushes forward
↓
Hero HUD emerges
```

Target:

Main menu dan homepage harus terasa berada dalam world yang sama.

---

# 7. World Loading Transition

Tambahkan world-entry choreography.

Possible sequence:

```text
0ms
Start pressed

100ms
menu controls disabled

120–350ms
menu buttons stagger out

300–650ms
brand/interface fade

450ms
"Generating world..." appears

450–850ms
terrain / blocks / particles move

750–1100ms
camera-like zoom forward

950–1250ms
loading overlay dissolves

1100ms+
Hero HUD begins reveal
```

Gunakan timing yang tidak terasa lambat.

User tidak boleh terjebak dalam cinematic panjang setiap kunjungan.

Suggested full sequence:

```text
800–1300ms
```

Jika user menggunakan reduced/minimal motion:

```text
simple fade / crossfade
≤ 250ms
```

---

# 8. ACT 1 — Spawn Point / Hero

Hero harus terasa seperti player baru saja spawn.

Existing:

```text
name
headline
introduction
CTA
portrait
location
```

Pertahankan content tersebut.

Tambahkan game-world framing.

Example HUD:

```text
WORLD: ADITYA.DEV
PLAYER: ADITYA
CLASS: SOFTWARE DEVELOPER
LOCATION: JEMBER
STATUS: ONLINE
```

Jangan terlalu literal seperti Minecraft clone.

Gunakan language visual dan interaction-inspired design.

### Hero choreography

Pada entry:

```text
world background
↓
HUD
↓
name
↓
headline
↓
portrait
↓
CTA
↓
world coordinates
```

Gunakan stagger yang jelas.

---

# 9. Hero Scroll Progression

Current HeroMotion hanya menggunakan pointer parallax.

Upgrade menjadi kombinasi:

```text
pointer input
+
scroll progress
```

Scroll pertama harus terasa seperti meninggalkan spawn point.

Contoh:

```text
scroll 0.0
full hero

scroll 0.25
portrait shifts slightly

scroll 0.40
name moves upward

scroll 0.55
world layer changes depth

scroll 0.70
coordinate HUD updates

scroll 1.0
transition into project world
```

Coordinate dapat berubah subtle:

```text
X 120 Y 64 Z 026
X 120 Y 63 Z 029
X 121 Y 62 Z 031
```

Jangan update terlalu cepat.

Efek hanya atmospheric.

---

# 10. ACT 2 — Discover the Builds

Section title tidak hanya:

```text
Selected Projects
```

Gunakan framing:

```text
DISCOVER THE BUILDS
Selected Projects
```

Existing ProjectStackSpread tetap digunakan.

Namun saat ini sequence berhenti setelah card spread.

Upgrade flow:

```text
Stack
↓
Cards spread
↓
One card becomes dominant
↓
Project storytelling begins
```

---

# 11. Project Cinematic Section

Buat maksimal 3–4 featured project story.

Jangan membuat semua project cinematic.

Recommended:

1. KandU
2. Time Capsule
3. GreenPoint
4. one experiment / IoT

Gunakan sticky story section.

Example:

```text
┌─────────────────────────────────────┐
│ QUEST 01                            │
│                                     │
│ K&U CAMPUS PLATFORM                 │
│                                     │
│ Role                                │
│ Full Stack Developer                │
│                                     │
│ Problem                             │
│ Campus information fragmented       │
│                                     │
│ Solution                            │
│ Unified production platform         │
│                                     │
│             [ Explore project → ]   │
└─────────────────────────────────────┘
```

Image / UI preview berada di sisi lain.

Scroll menggerakkan narrative stage.

---

# 12. Project Scroll Choreography

Example scroll state:

```text
0.00
stacked cards

0.15
cards spread

0.30
featured project #1 focused

0.45
project #1 information appears

0.55
project #1 moves away

0.65
project #2 enters

0.80
project #3 enters

1.00
View All Builds CTA
```

Tidak perlu pin terlalu lama.

User harus tetap merasa progress.

Maximum sticky scroll target:

```text
~2–3 viewport heights
```

hindari 6–10 viewport cinematic.

---

# 13. Project Grid

Setelah cinematic:

```text
VIEW ALL BUILDS
```

baru tampilkan current project gallery.

Pertahankan:

* filters
* quick view
* case-study links
* category metadata

Grid berfungsi sebagai browsing mode.

Cinematic berfungsi sebagai storytelling mode.

---

# 14. ACT 3 — Player Journey

Current Experience section harus diubah secara presentation.

Bukan sekadar daftar pekerjaan.

Gunakan:

```text
PLAYER JOURNEY
```

Format timeline vertical / world progression.

Example:

```text
2023
NETWORK TECHNICIAN
       │
       ↓
2024
INFORMATICS ENGINEERING
       │
       ↓
2025
GREENPOINT
       │
       ↓
2026
K&U CAMPUS PLATFORM
       │
       ↓
NOW
```

Saat user scroll:

* progression line grows
* nodes unlock
* year labels reveal
* selected milestones glow
* details expand

---

# 15. Achievement Integration

Achievement system jangan berdiri sendiri.

Journey milestones dapat memunculkan micro-feedback:

```text
ACHIEVEMENT UNLOCKED

Production Deployment
Built and deployed production systems
```

Tidak perlu muncul sebagai intrusive modal.

Gunakan toast kecil / subtle notification.

Contoh milestone:

```text
Production Deployment
Cloud Infrastructure
Full Stack Product
International Collaboration
IoT Experimentation
Open Source Contribution
```

Achievements harus berdasarkan data nyata dari portfolio.

Jangan membuat achievement palsu.

---

# 16. ACT 4 — Inventory / Skills

Current Skills section direframe menjadi:

```text
PLAYER INVENTORY
```

Tidak perlu menjadi Minecraft replica.

Gunakan grid modular.

Example:

```text
┌──────┬──────┬──────┬──────┐
│React │Next  │Node  │MySQL │
├──────┼──────┼──────┼──────┤
│Linux │Git   │Cloud │IoT   │
└──────┴──────┴──────┴──────┘
```

Hover / focus:

```text
Next.js

Level:
Production

Used in:
KandU
Portfolio
Time Capsule
```

Jangan menggunakan fabricated skill percentage.

Hindari:

```text
Next.js 95%
Node.js 90%
```

Gunakan evidence instead.

---

# 17. Skills Interaction

Desktop:

* hover
* pointer depth
* tooltips
* slight tile lift

Mobile:

* tap
* expandable details

Keyboard:

* focus reveals same content

Reduced motion:

* no 3D transform
* instant tooltip

---

# 18. ACT 5 — World / Project Categories

Project categories dapat diasosiasikan dengan subtle world themes.

Example:

```text
Professional
→ Overworld-inspired

Automation
→ Redstone-inspired

IoT
→ Workshop / laboratory

Infrastructure
→ Nether / industrial

Experimental
→ End / cosmic
```

Do not copy Minecraft assets literally.

Gunakan abstraction:

* texture
* particles
* icons
* ambient gradient
* coordinate/HUD styling

Theme transition harus subtle.

---

# 19. ACT 6 — About the Player

About section direframe:

```text
PLAYER PROFILE
```

Tetap profesional.

Content utama:

* who I am
* what I build
* how I work
* what I care about technically
* current focus

Jangan membuat about section terlalu game-like sehingga recruiter kesulitan membaca.

Game language adalah framing.

Informasi profesional tetap prioritas.

---

# 20. ACT 7 — End Portal / Contact

Contact section harus menjadi ending journey.

Concept:

```text
YOU REACHED THE END
```

followed by:

```text
Want to build something together?
```

Actions:

```text
Send message
LinkedIn
GitHub
Download CV
```

Tambahkan subtle portal / world-exit animation.

Tidak perlu WebGL.

CSS / DOM layer cukup.

---

# 21. Journey Loop

Setelah contact:

```text
Explore another world
```

Options:

```text
↑ Back to Projects
↑ Return to Spawn
↑ Open Main Menu
```

Ini membuat perjalanan tidak berhenti secara dead-end.

---

# 22. Motion System

Existing tokens:

```text
instant
fast
base
reveal
page
```

Pertahankan.

Tambahkan semantic choreography token:

```text
--motion-enter
--motion-exit
--motion-focus
--motion-world
--motion-story
```

Recommended conceptual ranges:

```text
micro feedback
80–180ms

UI state
180–280ms

component reveal
300–520ms

world transition
600–1000ms

cinematic sequence
800–1300ms
```

Hindari animations > 1500ms kecuali scroll-driven.

---

# 23. Motion Categories

Gunakan empat kategori:

## A. Feedback Motion

Untuk:

* buttons
* tabs
* filters
* focus
* hover

Fast.

## B. Transition Motion

Untuk:

* route transition
* menu transition
* modal
* quick view

Medium.

## C. Narrative Motion

Untuk:

* hero progression
* timeline
* project story
* world transition

Scroll-driven.

## D. Ambient Motion

Untuk:

* particles
* background layers
* coordinate HUD
* subtle world movement

Low intensity.

---

# 24. 21st.dev Policy

21st.dev boleh digunakan.

Namun:

* audit source code sebelum copy
* jangan copy library blindly
* adapt styles
* remove unnecessary dependencies
* respect current accessibility
* respect reduced motion
* follow current design tokens

Prefer patterns in categories:

```text
Story Scroll
Sticky Scroll
Scroll Choreography
Interactive Scrolling Story
Container Scroll Animation
Text Reveal
Stack Animation
```

Do not add multiple components that perform the same interaction.

---

# 25. Animation Library Policy

Current project tidak menggunakan Motion/Framer Motion atau GSAP sebagai core dependency.

Do not install animation library automatically.

Before adding:

* Motion
* Framer Motion
* GSAP
* Lenis
* Three.js

Codex must verify:

1. interaction cannot be implemented cleanly with existing CSS/WAAPI/IntersectionObserver;
2. dependency provides meaningful architectural benefit;
3. bundle impact is acceptable;
4. SSR / Next compatibility;
5. accessibility fallback exists.

Preferred implementation order:

```text
CSS transitions
↓
CSS keyframes
↓
Web Animations API
↓
IntersectionObserver
↓
requestAnimationFrame
↓
specialized animation library
```

---

# 26. Scroll Architecture

Avoid multiple global scroll listeners.

Build reusable utility:

```text
useScrollProgress()
```

or equivalent.

Input:

```text
element
startOffset
endOffset
```

Output:

```text
0 → 1
```

Use requestAnimationFrame batching.

Prefer IntersectionObserver to activate listeners only while section is near viewport.

---

# 27. Performance Requirements

Target:

* no visible frame drops
* avoid layout thrashing
* animate transform + opacity
* avoid repeated getBoundingClientRect calls across many components
* lazy-load heavy visual content
* no unnecessary WebGL
* no blocking animation dependency

Desktop target:

```text
60fps where realistic
```

Mobile:

prioritize responsiveness over cinematic effects.

---

# 28. Mobile Strategy

Mobile must not be desktop animation scaled down.

Use simplified choreography.

Desktop:

```text
sticky
depth
parallax
pointer
layer motion
```

Mobile:

```text
short reveal
horizontal swipe
compact stack
tap interaction
minimal parallax
```

Disable expensive effects when:

```text
pointer: coarse
width < 820px
graphics = low
motion != full
```

---

# 29. Accessibility

Must preserve:

* keyboard navigation
* focus visibility
* semantic HTML
* ARIA
* modal focus management
* prefers-reduced-motion
* language switching

No information may exist only inside animation.

All content must remain readable without motion.

---

# 30. Reduced Motion

Existing preference:

```text
full
reduced
minimal
off
```

Maintain.

Expected behavior:

### full

all narrative motion.

### reduced

simple transforms and fades.

### minimal

opacity only where needed.

### off

no motion except essential state changes.

---

# 31. Main Menu Re-entry

Navbar/menu control should allow:

```text
Open Main Menu
```

When reopened:

* current page state remains
* menu overlays the current world
* closing returns to previous focus
* no full intro cinematic on every reopen

---

# 32. Route Transitions

Current:

```text
Loading region
```

Keep concept.

Upgrade transition according to project/world destination.

Potential labels:

```text
Loading region
Entering project
Opening build
Returning to world
```

Do not randomize.

Label must match navigation context.

---

# 33. Project Case Study Entry

When opening a project:

```text
project card
↓
selected state
↓
route cover
↓
project title persists
↓
case study reveal
```

Create visual continuity.

Do not simply fade to unrelated page.

---

# 34. Section Transition Language

Each section should visually hand off to the next.

Example:

```text
Hero terrain
↓
project cards emerge from terrain

Project section
↓
journey path grows from project UI

Journey path
↓
becomes inventory grid guide

Inventory
↓
world fragments transition to profile

Profile
↓
portal opens
```

Transitions can be subtle.

The goal is continuity, not spectacle.

---

# 35. Content Priority

Recruiter must understand within 10 seconds:

```text
Who?
Aditya Fadni Athaullah

What?
Software developer / informatics engineer

What can he build?
Production web apps, backend systems, cloud infrastructure

Proof?
KandU + selected projects
```

Do not sacrifice clarity for game immersion.

---

# 36. Suggested Component Structure

Potential new structure:

```text
components/
  story/
    WorldEntry.tsx
    SpawnHUD.tsx
    StorySection.tsx
    ScrollProgress.tsx
    ProjectStory.tsx
    JourneyTimeline.tsx
    SkillInventory.tsx
    AchievementToast.tsx
    EndPortal.tsx

  motion/
    useScrollProgress.ts
    useMotionPreference.ts
    motion.ts
```

Only create abstractions when reused.

Avoid excessive component fragmentation.

---

# 37. Priority

## P0

Implement:

* world entry
* hero storytelling
* project story
* experience journey
* mobile/reduced-motion fallback

## P1

Implement:

* skill inventory
* achievement integration
* route continuity

## P2

Implement:

* category world themes
* ambient particles
* enhanced portal ending

---

# 38. Definition of Done

The redesign is successful when a first-time visitor can describe the site as:

> “It feels like entering Aditya's developer world.”

instead of:

> “It is a portfolio with Minecraft styling.”

Motion should explain progression.

Sections should feel connected.

The experience should remain professional enough for recruiters.

---

# 39. Final UX Flow

```text
MAIN MENU
    ↓
START PORTFOLIO
    ↓
GENERATING WORLD
    ↓
SPAWN POINT
    ↓
WHO IS ADITYA?
    ↓
DISCOVER THE BUILDS
    ↓
FEATURED QUESTS
    ↓
VIEW ALL BUILDS
    ↓
PLAYER JOURNEY
    ↓
PLAYER INVENTORY
    ↓
ACHIEVEMENTS
    ↓
PLAYER PROFILE
    ↓
END PORTAL
    ↓
CONTACT / RESTART / EXPLORE
```

This narrative architecture is the source of truth for future animation work.
