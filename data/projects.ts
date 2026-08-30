import { withBasePath } from "@/lib/constants";
import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "kandu",
    title: "KandU Campus Platform",
    subtitle: "Multi-campus platform for international students in South Korea.",
    description:
      "Production web work spanning reusable campus experiences, Firebase-backed information, automated data pipelines, and Linux deployment environments.",
    role: "Web Developer — Frontend & Backend",
    period: "2026 — Present",
    status: "production",
    statusLabel: "Production · Active Development",
    featured: true,
    categories: ["Professional", "Full Stack", "Web", "Automation"],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Firebase",
      "REST APIs",
      "Python automation",
      "Naver Maps / Leaflet",
      "Oracle Cloud",
      "Linux",
      "Nginx",
      "PM2",
      "GitHub Actions",
    ],
    primaryContribution:
      "Building and maintaining reusable campus experiences across frontend, backend integration, automated data flows, and production deployment environments.",
    problem:
      "International students need campus information in a usable, consistent format, while each university has different source data and campus-specific needs.",
    solution:
      "KandU uses reusable multi-campus patterns so shared product capabilities can serve different university environments without maintaining a completely separate site for each campus.",
    responsibilities: [
      "Worked on modern web interfaces and backend functionality with Next.js and React.",
      "Contributed reusable routing and site patterns across multiple campus environments.",
      "Integrated Firebase-backed menus, notices, maps, schedules, and student information.",
      "Worked with campus data produced by Python crawler and automation pipelines.",
      "Maintained production and beta deployment environments on Linux infrastructure.",
      "Supported GitHub-based release workflows and production debugging.",
    ],
    highlights: [
      "Reusable architecture supports multiple universities and campus contexts.",
      "Firebase data and automated collection pipelines feed current campus information.",
      "A separate beta environment supports testing before production releases.",
      "Deployment work covers Nginx, Node.js processes, PM2, and Oracle Cloud.",
    ],
    challenges: [
      {
        title: "Multi-campus consistency",
        description:
          "Keep shared product behavior reusable while allowing each campus to expose its own information and routes.",
      },
      {
        title: "Data integration",
        description:
          "Connect Firebase-backed application data with outputs from Python-based campus collection pipelines.",
      },
      {
        title: "Safe releases",
        description:
          "Maintain separate beta and production environments with GitHub-based delivery workflows and operational debugging.",
      },
    ],
    screenshots: [
      {
        src: withBasePath("/images/projects/kandu-production.png"),
        alt: "KandU Campus Platform production homepage showing campus search and university information",
        caption: "Production campus discovery experience",
      },
      {
        src: withBasePath("/images/projects/kandu-beta.png"),
        alt: "KandU beta homepage showing the campus platform and a community event preview",
        caption: "Separate beta environment used for development and testing",
      },
    ],
    links: [
      { label: "View Production", url: "https://campus.kandu.kr", kind: "production" },
      { label: "View Beta", url: "https://beta.kandu.kr", kind: "beta" },
    ],
  },
  {
    slug: "greenpoint",
    title: "GreenPoint — Digital Waste Bank Platform",
    subtitle: "Waste-bank operations, balances, transactions, and reporting in one product.",
    description:
      "A team-built full-stack system for managing customers, recyclable waste categories, deposits, account balances, withdrawals, and administrative reporting.",
    role: "Full-stack development in a team",
    period: "2025 — Present",
    status: "production",
    statusLabel: "Live Project",
    featured: true,
    categories: ["Full Stack", "Web"],
    technologies: [
      "PHP",
      "Laravel",
      "Bootstrap",
      "JavaScript",
      "REST API",
      "PostgreSQL",
      "Supabase",
      "MySQL",
      "Flutter",
    ],
    primaryContribution:
      "Contributing across customer and administrator workflows, API integration, relational data, reporting, and the Flutter client.",
    problem:
      "Waste-bank teams need to track customer approval, recyclable material values, deposit transactions, balances, withdrawals, and reports without fragmented manual records.",
    solution:
      "GreenPoint brings customer and administrative workflows into a single digital product, with web and mobile-facing stages developed as the project evolved.",
    responsibilities: [
      "Worked on user registration and account approval flows.",
      "Implemented waste type and deposit transaction management.",
      "Worked on balances, withdrawal workflows, and administrative controls.",
      "Supported financial and operational reports, including Excel/PDF output.",
      "Contributed across the web application, API integration, database layers, and Flutter client work.",
    ],
    highlights: [
      "Customer registration and administrative approval workflow.",
      "Waste categories, deposits, balances, and withdrawal management.",
      "Financial and operational reporting with Excel/PDF output.",
      "One product that progressed through different database and deployment stages.",
    ],
    challenges: [
      {
        title: "Product evolution",
        description:
          "The database architecture moved through MySQL and PostgreSQL/Supabase-backed stages as the product and deployment needs changed.",
      },
      {
        title: "Workflow integrity",
        description:
          "Customer approval, deposits, balances, and withdrawals require clear state transitions across user and administrator views.",
      },
      {
        title: "Operational reporting",
        description:
          "Administrative data must be converted into useful customer, transaction, waste, and financial reports.",
      },
    ],
    screenshots: [
      {
        src: withBasePath("/images/projects/greenpoint-postgresql.png"),
        alt: "GreenPoint digital waste bank landing page",
        caption: "GreenPoint public product experience",
      },
      {
        src: withBasePath("/images/projects/greenpoint-mysql.png"),
        alt: "Earlier GreenPoint deployment landing page",
        caption: "An earlier technical stage of the same GreenPoint product",
      },
    ],
    links: [
      { label: "Live Demo", url: "https://green-point.app", kind: "demo" },
      {
        label: "View Repository",
        url: "https://github.com/CL4Y0101/BankSampah-GreenPoint",
        kind: "repository",
      },
    ],
  },
  {
    slug: "time-capsule",
    title: "Time Capsule",
    subtitle: "An interactive 3D space for preserving and revisiting shared memories.",
    description:
      "A multilingual Next.js experience that combines an explorable Three.js world with timelines, photo galleries, public messages, audio, theme controls, and AI-assisted character conversations.",
    role: "Web Developer",
    period: "2026",
    status: "completed",
    statusLabel: "Interactive Prototype",
    featured: true,
    categories: ["Full Stack", "Web"],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Three.js",
      "React Three Fiber",
      "GSAP",
      "Groq SDK",
      "Cloudflare",
      "OpenNext",
      "Fly.io",
    ],
    primaryContribution:
      "Building the multilingual Next.js experience, its interactive 3D world, supporting interface flows, and deployment preparation.",
    problem:
      "A conventional gallery does not capture the feeling of exploring a set of shared moments, people, and messages.",
    solution:
      "The project turns those memories into an interactive 3D world where objects open a timeline, gallery, and message board, while characters provide conversational entry points.",
    responsibilities: [
      "Built the experience with Next.js, React, TypeScript, and Zustand state management.",
      "Implemented an explorable React Three Fiber world with interactive landmarks and characters.",
      "Created Indonesian, English, and Korean interface variants.",
      "Added timeline, gallery, public message, audio, light/dark, and ending flows.",
      "Integrated AI-assisted chat routes and prepared the Next.js application for Cloudflare through OpenNext.",
    ],
    highlights: [
      "Interactive 3D environment rather than a conventional content grid.",
      "Three-language interface: Indonesian, English, and Korean.",
      "Timeline, photo gallery, and public message experiences.",
      "AI-assisted character and capsule companion conversations.",
    ],
    challenges: [
      {
        title: "3D interaction in React",
        description:
          "Coordinate camera movement, interactive scene objects, overlays, and UI state without losing the exploratory feel.",
      },
      {
        title: "Media and motion",
        description:
          "Combine WebGL, GSAP transitions, sound effects, and background audio while keeping user controls explicit.",
      },
      {
        title: "Edge deployment",
        description:
          "Prepare a Next.js application with API routes for a Cloudflare deployment model through OpenNext.",
      },
    ],
    screenshots: [],
    links: [
      {
        label: "Visit Website",
        url: "https://tiga-capsule.e41240068.workers.dev/",
        kind: "demo",
      },
      {
        label: "View Repository",
        url: "https://github.com/CL4Y0101/tiga-capsule",
        kind: "repository",
      },
    ],
  },
  {
    slug: "ytmusic-esp32",
    title: "YouTube Music × ESP32",
    subtitle: "Browser media metadata sent to a local ESP32 display.",
    description:
      "An in-progress Chrome extension prototype that reads YouTube Music playback metadata and sends title, artist, progress, duration, and pause state as JSON to an ESP32 endpoint on the local network.",
    role: "Developer · Experiment",
    period: "In progress",
    status: "in-progress",
    statusLabel: "In Progress",
    featured: true,
    categories: ["Automation", "IoT / Experiments"],
    technologies: ["JavaScript", "Chrome Extension APIs", "ESP32", "HTTP", "JSON", "Wi-Fi"],
    primaryContribution:
      "Prototyping the browser-to-device data path from YouTube Music playback state to a local ESP32 HTTP endpoint.",
    problem:
      "Media information playing in a browser is not directly available to a small external hardware display.",
    solution:
      "A Manifest V3 extension reads the active YouTube Music player state and relays a compact now-playing payload to an ESP32 HTTP endpoint on the same network.",
    responsibilities: [
      "Created the Manifest V3 Chrome extension structure.",
      "Read title, artist, duration, playback position, and paused state from YouTube Music.",
      "Relayed browser data through a background service worker to a local HTTP endpoint.",
      "Kept the experiment clearly separated from finished production work.",
    ],
    highlights: [
      "Browser-to-device now-playing data flow.",
      "Compact HTTP/JSON payload designed for a local embedded target.",
      "Frequent playback state updates for a near-real-time display.",
    ],
    challenges: [
      {
        title: "Browser integration",
        description:
          "YouTube Music exposes player data through changing page structures, so the content script checks several selectors and media elements.",
      },
      {
        title: "Local device delivery",
        description:
          "The background worker bridges a secure browser page to an HTTP device endpoint on the local network.",
      },
      {
        title: "Work still in progress",
        description:
          "The public repository currently demonstrates the browser-side prototype; hardware firmware and a complete packaged workflow are not presented as finished.",
      },
    ],
    screenshots: [],
    links: [
      {
        label: "View Repository",
        url: "https://github.com/CL4Y0101/ytbmusic-withesp32",
        kind: "repository",
      },
    ],
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
