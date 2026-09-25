import type { Project, ProjectCategory } from "./types";

export function categoryWorld(category: ProjectCategory | "All") {
  if (category === "IoT / Experiments") return "workshop";
  if (category === "Automation") return "signal";
  if (category === "Professional") return "terrain";
  if (category === "Full Stack") return "architecture";
  if (category === "Web") return "sky";
  return "neutral";
}

export function projectWorld(project: Project) {
  // Priority is deterministic for projects with more than one existing category.
  const category = (["IoT / Experiments", "Professional", "Automation", "Full Stack", "Web"] as const)
    .find((value) => project.categories.includes(value));
  return categoryWorld(category ?? "All");
}
