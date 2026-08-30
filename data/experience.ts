import type { Experience } from "@/lib/types";

export const experience: Experience[] = [
  {
    id: "kandu",
    organization: "KandU / Korea & You",
    role: "Web Developer — Frontend & Backend",
    period: "2026 — Present",
    location: "Remote · South Korea-based product team",
    summary:
      "Contributing to a multi-campus digital platform that helps international students find useful university and campus information in South Korea.",
    featured: true,
    statusLabel: "Current experience",
    projectSlug: "kandu",
    technologies: ["Next.js", "React", "TypeScript", "Firebase", "Python automation", "Linux", "Nginx", "PM2"],
    responsibilities: [
      "Develop and maintain Next.js and React interfaces alongside backend web functionality.",
      "Work on reusable multi-campus routing and site patterns for different university environments.",
      "Integrate Firebase-backed data for menus, notices, maps, schedules, and other student information.",
      "Work with data produced by Python campus crawlers and automation pipelines.",
      "Maintain production and beta deployments on Linux-based Oracle Cloud infrastructure using Nginx, Node.js processes, and PM2.",
      "Support GitHub-based release workflows and debug build, dependency, networking, and deployment issues.",
    ],
  },
  {
    id: "kominfo-jember",
    organization: "Dinas Komunikasi dan Informatika / Kominfo Jember",
    role: "Internship / PKL — Sekretariat",
    period: "Internship / PKL",
    location: "Jember, Indonesia",
    summary:
      "Supported administrative operations and digital documentation for public communication activities.",
    technologies: ["Digital documentation", "YouTube Live", "Camera operations"],
    responsibilities: [
      "Handled administrative and operational data entry.",
      "Operated cameras during government activities.",
      "Supported YouTube livestream production and digital documentation.",
      "Collaborated with staff during Dinas Jember public communication activities.",
    ],
  },
  {
    id: "greenpoint",
    organization: "GreenPoint Project",
    role: "Full-stack Developer · Team Project",
    period: "2025 — Present",
    location: "Jember, Indonesia",
    summary:
      "Contributing to a digital waste-bank product that connects customer onboarding, recyclable deposits, balances, withdrawals, and administrative reporting.",
    projectSlug: "greenpoint",
    technologies: ["Laravel", "PHP", "JavaScript", "REST API", "PostgreSQL", "Supabase", "MySQL", "Flutter"],
    responsibilities: [
      "Worked on customer registration, approval, and administrative workflows.",
      "Implemented waste type, deposit, balance, and withdrawal functionality.",
      "Supported operational reporting and the product's evolving web, API, database, and mobile layers.",
    ],
  },
];
