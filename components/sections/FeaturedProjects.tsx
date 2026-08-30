"use client";

import { useState } from "react";
import { featuredProjects } from "@/data/projects";
import type { Project, ProjectCategory } from "@/lib/types";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectQuickView } from "@/components/projects/ProjectQuickView";

const categories: Array<"All" | ProjectCategory> = [
  "All",
  "Professional",
  "Full Stack",
  "Web",
  "Automation",
  "IoT / Experiments",
];

export function FeaturedProjects() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [quickViewProject, setQuickViewProject] = useState<Project | null>(null);
  const visibleProjects =
    activeCategory === "All"
      ? featuredProjects
      : featuredProjects.filter((project) => project.categories.includes(activeCategory));

  return (
    <section className="section section-work" id="work" aria-labelledby="work-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Selected work"
          titleId="work-title"
          title="Products with real constraints, users, and infrastructure."
          description="Production work comes first, followed by full-stack product development and clearly labeled experiments."
          action={
            <div className="filter-list" aria-label="Filter selected work">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={activeCategory === category ? "filter-active" : ""}
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          }
        />

        <p className="filter-status sr-only" aria-live="polite">
          Showing {visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"} for {activeCategory}.
        </p>
        <div className="projects-grid">
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={`${activeCategory}-${project.slug}`}
              project={project}
              priority={index === 0 && activeCategory === "All"}
              onQuickView={setQuickViewProject}
            />
          ))}
        </div>
      </div>
      <ProjectQuickView project={quickViewProject} onClose={() => setQuickViewProject(null)} />
    </section>
  );
}
