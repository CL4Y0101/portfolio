import { ArrowUpRight, Eye, GitFork, Layers3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

export function ProjectCard({
  project,
  priority = false,
  onQuickView,
}: {
  project: Project;
  priority?: boolean;
  onQuickView: (project: Project) => void;
}) {
  const repository = project.links.find((link) => link.kind === "repository");
  const liveLink = project.links.find((link) => link.kind === "production" || link.kind === "demo");

  return (
    <article className={`project-card ${project.categories.includes("Professional") ? "project-card-prominent" : ""}`}>
      {project.screenshots[0] ? (
        <Link className="project-media" href={`/projects/${project.slug}`} prefetch={false} aria-label={`Read ${project.title} case study`}>
          <Image
            src={project.screenshots[0].src}
            alt={project.screenshots[0].alt}
            width={1440}
            height={1000}
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 42vw"
          />
        </Link>
      ) : (
        <Link className="project-placeholder" href={`/projects/${project.slug}`} prefetch={false} aria-label={`Read ${project.title} case study`}>
          <Layers3 aria-hidden="true" size={34} strokeWidth={1.5} />
          <span>{project.technologies.slice(0, 3).join(" · ")}</span>
        </Link>
      )}

      <div className="project-card-body">
        <div className="project-meta">
          <Badge tone={project.status === "production" ? "live" : project.status === "in-progress" ? "warm" : "default"}>
            {project.statusLabel}
          </Badge>
          <span>{project.categories[0]}</span>
        </div>

        <div>
          <h3>
            <Link href={`/projects/${project.slug}`} prefetch={false}>{project.title}</Link>
          </h3>
          <p>{project.description}</p>
        </div>

        <ul className="project-stack" aria-label={`${project.title} technologies`}>
          {project.technologies.slice(0, 5).map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>

        <div className="project-card-actions">
          <div className="project-action-links">
            <Link className="text-link" href={`/projects/${project.slug}`} prefetch={false}>
              Read case study <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
            <button className="text-link quick-view-button" type="button" onClick={() => onQuickView(project)}>
              Quick view <Eye aria-hidden="true" size={16} />
            </button>
          </div>
          {liveLink ? (
            <a className="icon-link" href={liveLink.url} target="_blank" rel="noreferrer" aria-label={`${liveLink.label}: ${project.title}`}>
              <ArrowUpRight aria-hidden="true" size={17} />
            </a>
          ) : repository ? (
            <a className="icon-link" href={repository.url} target="_blank" rel="noreferrer" aria-label={`View ${project.title} repository`}>
              <GitFork aria-hidden="true" size={17} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
