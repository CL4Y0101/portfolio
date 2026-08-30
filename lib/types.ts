export type ProjectStatus = "production" | "completed" | "in-progress";

export type ProjectCategory =
  | "Professional"
  | "Full Stack"
  | "Web"
  | "Automation"
  | "IoT / Experiments";

export type ProjectLink = {
  label: string;
  url: string;
  kind: "production" | "beta" | "repository" | "demo";
};

export type ProjectScreenshot = {
  src: string;
  alt: string;
  caption: string;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  role: string;
  period: string;
  status: ProjectStatus;
  statusLabel: string;
  featured: boolean;
  categories: ProjectCategory[];
  technologies: string[];
  primaryContribution: string;
  responsibilities: string[];
  highlights: string[];
  challenges: Array<{ title: string; description: string }>;
  problem: string;
  solution: string;
  screenshots: ProjectScreenshot[];
  links: ProjectLink[];
};

export type Experience = {
  id: string;
  organization: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  projectSlug?: string;
  statusLabel?: string;
  featured?: boolean;
};

export type Education = {
  institution: string;
  program: string;
  period?: string;
  detail?: string;
};

export type Achievement = {
  title: string;
  issuer: string;
  date?: string;
  detail: string;
  featured?: boolean;
};

export type SkillGroup = {
  id: string;
  title: string;
  description: string;
  skills: Array<{ name: string; emphasis?: "primary" | "supporting" | "exploring" }>;
  appliedProjectSlugs: string[];
};
