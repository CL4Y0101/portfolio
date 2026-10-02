import { ArrowUpRight, GitBranch, GitFork } from "lucide-react";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { ContributionGraph } from "@/components/ui/ContributionGraph";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getGitHubContributions } from "@/lib/github-contributions";
import styles from "@/components/ui/contribution-graph.module.css";

const publicProjects = projects.filter((project) => project.links.some((link) => link.kind === "repository"));

export async function OpenSource() {
  const calendar = await getGitHubContributions();

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
          <div className={styles.heading}>
            <div>
              <p className="eyebrow"><LocalizedText en="GITHUB / ACTIVITY" id="GITHUB / AKTIVITAS" /></p>
              <h3><LocalizedText en="Contribution activity" id="Aktivitas kontribusi" /></h3>
            </div>
            <a href={profile.github} target="_blank" rel="noreferrer">
              <LocalizedText en="View profile" id="Lihat profil" />
            </a>
          </div>
          {calendar ? (
            <>
              <ContributionGraph calendar={calendar} />
              <p className={styles.source}>
                <LocalizedText en={`Activity shown on GitHub through ${calendar.asOf}.`} id={`Aktivitas yang ditampilkan GitHub hingga ${calendar.asOf}.`} />
              </p>
            </>
          ) : (
            <p className={styles.unavailable} role="status">
              <LocalizedText en="Contribution data is temporarily unavailable. Visit GitHub for the latest activity." id="Data kontribusi sementara tidak tersedia. Kunjungi GitHub untuk aktivitas terbaru." />
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
