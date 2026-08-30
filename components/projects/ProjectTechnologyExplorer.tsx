"use client";

import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/lib/types";

const portfolioTechnologies = new Set(["Next.js", "React", "TypeScript", "Tailwind CSS"]);

export function ProjectTechnologyExplorer({ project, projects }: { project: Project; projects: Project[] }) {
  const [activeTechnology, setActiveTechnology] = useState(project.technologies[0]);
  const relatedProjects = projects.filter((item) => item.technologies.includes(activeTechnology));
  const includesPortfolio = portfolioTechnologies.has(activeTechnology);

  return (
    <div className="technology-explorer">
      <div className="technology-picker" aria-label="Explore technology usage">
        {project.technologies.map((technology) => (
          <button
            key={technology}
            type="button"
            className={technology === activeTechnology ? "technology-active" : ""}
            aria-pressed={technology === activeTechnology}
            onClick={() => setActiveTechnology(technology)}
          >
            {technology}
          </button>
        ))}
      </div>

      <div className="technology-usage" aria-live="polite">
        <span>Where I used {activeTechnology}</span>
        <div>
          {relatedProjects.map((item) => (
            <Link key={item.slug} href={`/projects/${item.slug}`} prefetch={false}>{item.title}</Link>
          ))}
          {includesPortfolio ? <span>This portfolio</span> : null}
        </div>
      </div>
    </div>
  );
}
