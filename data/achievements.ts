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
  {
    title: "Grand Finalist, Top 9",
    issuer: "GenoHack 2026 · Institut Teknologi Bandung",
    date: "October 2026",
    detail: "AquaSeq eDNA shrimp-disease early warning, with team Disubmit Kok Tir Aman Ajah.",
    featured: true,
  },
];

export const leadership = {
  title: "Cohort Lead / Ketua Angkatan",
  organization: "Politeknik Negeri Jember",
  description:
    "Coordinating communication and collaboration across the Informatics Engineering cohort while balancing academic and technical project responsibilities.",
};

export type LocalText = { en: string; id: string };

export type AchievementArchiveFile = {
  name: LocalText;
  meta?: LocalText;
  image?: string;
  lockedNote?: LocalText;
};

export type AchievementArchive = {
  label: LocalText;
  meta?: LocalText;
  status?: LocalText;
  tone?: "light" | "dark";
  cover?: string;
  files: AchievementArchiveFile[];
};

/** Evidence folders rendered under the achievements grid: one folder per event. */
export const achievementArchives: AchievementArchive[] = [
  {
    label: { en: "Hackathon PENS 2026", id: "Hackathon PENS 2026" },
    meta: {
      en: "Best Design UI/UX + Finalist · Tessera · Surabaya, 9 to 10 Oct 2026",
      id: "Best Design UI/UX + Finalist · Tessera · Surabaya, 9 s/d 10 Okt 2026",
    },
    status: { en: "UNLOCKED", id: "TERBUKA" },
    tone: "light",
    cover: "/images/achievements/pens-team-1.jpg",
    files: [
      {
        name: { en: "Best Design UI/UX certificate", id: "Sertifikat Best Design UI/UX" },
        meta: { en: "Special award", id: "Penghargaan khusus" },
        image: "/images/achievements/pens-cert-best-ui-ux.png",
      },
      {
        name: { en: "Finalist certificate", id: "Sertifikat Finalist" },
        meta: { en: "Hackathon PENS 2026", id: "Hackathon PENS 2026" },
        image: "/images/achievements/pens-cert-finalist.png",
      },
      {
        name: { en: "Team photo at the backdrop (1)", id: "Foto tim di backdrop (1)" },
        meta: { en: "Team Positif dan Professional", id: "Tim Positif dan Professional" },
        image: "/images/achievements/pens-team-1.jpg",
      },
      {
        name: { en: "Team photo with Pak Aji at the backdrop", id: "Foto tim bersama Pak Aji di backdrop" },
        meta: { en: "Team Positif dan Professional", id: "Tim Positif dan Professional" },
        image: "/images/achievements/pens-team-2.jpg",
      },
    ],
  },
  {
    label: { en: "GenoHack 2026 · ITB", id: "GenoHack 2026 · ITB" },
    meta: {
      en: "Grand Finalist, Top 9 · AquaSeq · Bandung, 23 to 25 Oct 2026",
      id: "Grand Finalist 9 Besar · AquaSeq · Bandung, 23 s/d 25 Okt 2026",
    },
    status: { en: "GRAND FINALIST", id: "GRAND FINALIST" },
    tone: "dark",
    cover: "/images/achievements/genohack-group.jpg",
    files: [
      {
        name: { en: "Final day group photo", id: "Foto bersama final day" },
        meta: { en: "ITB auditorium", id: "Auditorium ITB" },
        image: "/images/achievements/genohack-group.jpg",
      },
      {
        name: { en: "Team with their liaison officer", id: "Tim bareng LO pendamping" },
        meta: { en: "In front of the GenoHack screen", id: "Di depan layar GenoHack" },
        image: "/images/achievements/genohack-team-lo.jpg",
      },
      {
        name: { en: "The five-person team", id: "Tim berlima" },
        meta: { en: "Green jackets, GenoHack screen", id: "Jaket hijau, layar GenoHack" },
        image: "/images/achievements/genohack-team.jpg",
      },
      {
        name: { en: "GenoHack certificate", id: "Sertifikat GenoHack" },
        meta: { en: "Not yet issued", id: "Belum terbit" },
        lockedNote: {
          en: "The GenoHack certificate has not been issued by the organizers yet. This file stays locked until the official certificate is out.",
          id: "Sertifikat GenoHack belum terbit dari panitia. File ini dikunci sampai sertifikat resminya keluar.",
        },
      },
    ],
  },
];
