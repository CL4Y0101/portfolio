"use client";

import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import type { Project } from "@/lib/types";
import ui from "@/components/game-ui/minecraft.module.css";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { projectCopyId } from "@/data/project-copy-id";
import { useLanguage } from "@/components/ui/useLanguage";

type ProjectQuickViewProps = {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  onAfterClose: () => void;
};

export function ProjectQuickView({ project, open, onClose, onAfterClose }: ProjectQuickViewProps) {
  const titleId = "project-quick-view-title";
  const language = useLanguage();
  const copy = project ? projectCopyId[project.slug] : null;

  return (
    <Dialog open={open} onClose={onClose} onAfterClose={onAfterClose} labelledBy={titleId} className="quick-view-dialog">
      {project ? (
        <div className={`dialog-panel quick-view-panel ${ui.dialog}`}>
          <div className="dialog-heading">
            <div>
              <p className="eyebrow"><LocalizedText en="Project quick view" /></p>
              <h2 id={titleId}>{project.title}</h2>
            </div>
            <button data-autofocus className="icon-button" type="button" onClick={onClose} aria-label={language === "id" ? "Tutup ringkasan proyek" : "Close project quick view"}>
              <X aria-hidden="true" size={20} />
            </button>
          </div>

          <div className="quick-view-summary">
            <Badge tone={project.status === "production" ? "live" : project.status === "in-progress" ? "warm" : "default"}>
              <LocalizedText en={project.statusLabel} />
            </Badge>
            <span><LocalizedText en={project.role} id={copy?.role} /></span>
          </div>

          <p className="quick-view-description"><LocalizedText en={project.description} id={copy?.description} /></p>

          <div className="quick-view-grid">
            <section>
              <h3><LocalizedText en="Problem" /></h3>
              <p><LocalizedText en={project.problem} id={copy?.problem} /></p>
            </section>
            <section>
              <h3><LocalizedText en="Solution" /></h3>
              <p><LocalizedText en={project.solution} id={copy?.solution} /></p>
            </section>
            <section>
              <h3><LocalizedText en="Primary contribution" /></h3>
              <p><LocalizedText en={project.primaryContribution} id={copy?.primaryContribution} /></p>
            </section>
            <section>
              <h3><LocalizedText en="Technology stack" /></h3>
              <ul className="project-stack" aria-label={`${project.title} technology stack`}>
                {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
            </section>
          </div>

          <div className="dialog-actions">
            <Link className="button button-primary" href={`/projects/${project.slug}`} prefetch={false} onClick={onClose}>
              <LocalizedText en="View case study" /> <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
            {project.links.map((link, index) => (
              <a key={link.label} className="button button-secondary" href={link.url} target="_blank" rel="noreferrer">
                <LocalizedText en={link.label} id={copy?.linkLabels[index]} /> <ArrowUpRight aria-hidden="true" size={16} />
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </Dialog>
  );
}
