"use client";

import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import type { Project } from "@/lib/types";

type ProjectQuickViewProps = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectQuickView({ project, onClose }: ProjectQuickViewProps) {
  const titleId = "project-quick-view-title";

  return (
    <Dialog open={Boolean(project)} onClose={onClose} labelledBy={titleId} className="quick-view-dialog">
      {project ? (
        <div className="dialog-panel quick-view-panel">
          <div className="dialog-heading">
            <div>
              <p className="eyebrow">Project quick view</p>
              <h2 id={titleId}>{project.title}</h2>
            </div>
            <button data-autofocus className="icon-button" type="button" onClick={onClose} aria-label="Close project quick view">
              <X aria-hidden="true" size={20} />
            </button>
          </div>

          <div className="quick-view-summary">
            <Badge tone={project.status === "production" ? "live" : project.status === "in-progress" ? "warm" : "default"}>
              {project.statusLabel}
            </Badge>
            <span>{project.role}</span>
          </div>

          <p className="quick-view-description">{project.description}</p>

          <div className="quick-view-grid">
            <section>
              <h3>Problem</h3>
              <p>{project.problem}</p>
            </section>
            <section>
              <h3>Solution</h3>
              <p>{project.solution}</p>
            </section>
            <section>
              <h3>Primary contribution</h3>
              <p>{project.primaryContribution}</p>
            </section>
            <section>
              <h3>Technology stack</h3>
              <ul className="project-stack" aria-label={`${project.title} technology stack`}>
                {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
            </section>
          </div>

          <div className="dialog-actions">
            <Link className="button button-primary" href={`/projects/${project.slug}`} prefetch={false} onClick={onClose}>
              View case study <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
            {project.links.map((link) => (
              <a key={link.label} className="button button-secondary" href={link.url} target="_blank" rel="noreferrer">
                {link.label} <ArrowUpRight aria-hidden="true" size={16} />
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </Dialog>
  );
}
