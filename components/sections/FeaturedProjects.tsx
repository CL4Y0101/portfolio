"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { featuredProjects } from "@/data/projects";
import type { Project, ProjectCategory } from "@/lib/types";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectQuickView } from "@/components/projects/ProjectQuickView";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { motionDurations, motionStagger } from "@/components/motion/motion";

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
  const [renderedCategory, setRenderedCategory] = useState<(typeof categories)[number]>("All");
  const [filterPhase, setFilterPhase] = useState<"idle" | "out" | "in">("idle");
  const [quickViewProject, setQuickViewProject] = useState<Project | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const filterTimers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const reducedMotion = useReducedMotion();
  const visibleProjects =
    renderedCategory === "All"
      ? featuredProjects
      : featuredProjects.filter((project) => project.categories.includes(renderedCategory));

  useEffect(() => () => filterTimers.current.forEach(clearTimeout), []);

  const openQuickView = useCallback((project: Project) => {
    setQuickViewProject(project);
    setQuickViewOpen(true);
  }, []);

  const clearQuickView = useCallback(() => setQuickViewProject(null), []);

  function selectCategory(category: (typeof categories)[number]) {
    if (category === activeCategory) return;
    filterTimers.current.forEach(clearTimeout);
    filterTimers.current = [];
    setActiveCategory(category);

    if (reducedMotion) {
      setRenderedCategory(category);
      setFilterPhase("idle");
      return;
    }

    setFilterPhase("out");
    filterTimers.current.push(setTimeout(() => {
      setRenderedCategory(category);
      setFilterPhase("in");
      const incomingDuration = motionDurations.base + motionStagger.step * motionStagger.maximumItems;
      filterTimers.current.push(setTimeout(() => setFilterPhase("idle"), incomingDuration));
    }, motionDurations.fast));
  }

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
                  onClick={() => selectCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          }
        />

        <p className="filter-status sr-only" aria-live="polite">
          Showing {visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"} for {renderedCategory}.
        </p>
        <div className="projects-grid" data-scroll-reveal="stagger" data-filter-phase={filterPhase} aria-busy={filterPhase === "out"}>
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              priority={index === 0 && activeCategory === "All"}
              onQuickView={openQuickView}
            />
          ))}
        </div>
      </div>
      <ProjectQuickView
        project={quickViewProject}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        onAfterClose={clearQuickView}
      />
    </section>
  );
}
