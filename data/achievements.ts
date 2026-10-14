import type { Achievement } from "@/lib/types";

/** Unlocked as a toast after the first world-entry intro; referenced by AchievementToast. */
export const bestUiUxAchievement: Achievement = {
  title: "Best Design UI/UX",
  issuer: "Hackathon PENS 2026",
  date: "October 2026",
  detail: "Awarded for the Tessera project with team Positif dan Professional.",
  featured: true,
};

export const achievements: Achievement[] = [
  bestUiUxAchievement,
  {
    title: "English Proficiency Test — Rank #1",
    issuer: "Politeknik Negeri Jember, 2025",
    date: "April 2025",
    detail: "Score: 148 / 150",
    featured: true,
  },
  {
    title: "Computer and Network Engineering Competency Certification",
    issuer: "LSP · Vocational school competency certification",
    detail: "Verified vocational competency in computer and network engineering.",
  },
  {
    title: "Achievement-Based Admission",
    issuer: "Politeknik Negeri Jember",
    detail: "Admitted through the SNBP achievement-based admission pathway.",
  },
];

export const leadership = {
  title: "Cohort Lead / Ketua Angkatan",
  organization: "Politeknik Negeri Jember",
  description:
    "Coordinating communication and collaboration across the Informatics Engineering cohort while balancing academic and technical project responsibilities.",
};
