import Image from "next/image";
import Link from "next/link";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { projectCopyId } from "@/data/project-copy-id";
import type { Project } from "@/lib/types";
import styles from "./project-stack-spread.module.css";
import { projectWorld } from "@/lib/project-world";

export function ProjectStoryPanel({ project, index, active }: { project: Project; index: number; active: boolean }) {
  const copy = projectCopyId[project.slug];
  const cover = project.screenshots[0];
  return (
    <article className={styles.quest} data-project-world={projectWorld(project)} data-active={active} data-quest={index} aria-labelledby={`quest-${project.slug}`}>
      {cover ? <Image data-project-cover={project.slug} className={styles.preview} src={cover.src} alt={cover.alt} width={720} height={450} sizes="(max-width: 700px) 100vw, 50vw" /> : null}
      <p className={styles.status}>{String(index + 1).padStart(2, "0")} / <LocalizedText en={project.statusLabel} /></p>
      <h3 id={`quest-${project.slug}`}>{project.title}</h3>
      <p className={styles.role}><LocalizedText en={project.role} id={copy?.role} /></p>
      <dl>
        <div><dt><LocalizedText en="Problem" /></dt><dd><LocalizedText en={project.problem} id={copy?.problem} /></dd></div>
        <div><dt><LocalizedText en="Solution" /></dt><dd><LocalizedText en={project.solution} id={copy?.solution} /></dd></div>
      </dl>
      <ul className="project-stack">{project.technologies.slice(0, 5).map((technology) => <li key={technology}>{technology}</li>)}</ul>
      <Link className="text-link" href={`/projects/${project.slug}`} prefetch={false}>
        <LocalizedText en="View case study" /> <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
