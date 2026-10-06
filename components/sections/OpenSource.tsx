import type { CSSProperties } from "react";
import { ArrowUpRight, GitBranch, GitFork } from "lucide-react";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { ContributionSkylineLocalized } from "@/components/ui/ContributionSkylineLocalized";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getContributionDays, getContributionsAsOf } from "@/lib/github-contributions";
import styles from "@/components/ui/contribution-graph.module.css";

const publicProjects = projects.filter((project) => project.links.some((link) => link.kind === "repository"));

// Maps the skyline's theme variables onto the portfolio design tokens so the
// canvas picks up light/dark mode (it watches `data-theme` on <html>).
const skylineTheme = {
  "--color-background": "var(--background-raised)",
  "--color-foreground": "var(--text)",
  "--color-border": "var(--line)",
  "--color-muted-foreground": "var(--muted)",
} as CSSProperties;

export function OpenSource() {
  const days = getContributionDays();
  const asOf = getContributionsAsOf();

  return (
    <section className="section section-tinted" aria-labelledby="open-source-title">
      <div className="shell open-source-grid">
        <SectionHeading
          eyebrow="GitHub / Open source"
          titleId="open-source-title"
          title="Selected public code."
          description="Relevant repositories, linked directly to the work."
        />
        <div className="repo-card" data-scroll-reveal>
          <div className="repo-card-top">
            <GitFork aria-hidden="true" size={27} />
            <a href={profile.github} target="_blank" rel="noreferrer">
              github.com/CL4Y0101 <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          </div>
          <ul data-scroll-reveal="stagger">
            {publicProjects.map((project) => {
              const repository = project.links.find((link) => link.kind === "repository");
              return (
                <li key={project.slug}>
                  <GitBranch aria-hidden="true" size={17} />
                  <div>
                    <strong>{project.title}</strong>
                    <span>{project.technologies.slice(0, 3).join(" · ")}</span>
                  </div>
                  <a href={repository?.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} repository`}>
                    <ArrowUpRight aria-hidden="true" size={17} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={styles.panel} data-scroll-reveal>
          <div style={skylineTheme}>
            <ContributionSkylineLocalized days={days} asOf={asOf ?? undefined} />
          </div>
          <p className={styles.source}>
            {asOf ? (
              <LocalizedText
                en={`Activity shown on GitHub through ${asOf}. `}
                id={`Aktivitas yang ditampilkan GitHub hingga ${asOf}. `}
              />
            ) : (
              <LocalizedText
                en="Contribution data is temporarily unavailable. "
                id="Data kontribusi sementara tidak tersedia. "
              />
            )}
            <a href={profile.github} target="_blank" rel="noreferrer">
              <LocalizedText en="View profile" id="Lihat profil" />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
