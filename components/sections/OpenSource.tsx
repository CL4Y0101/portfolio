import { ArrowUpRight, GitBranch, GitFork } from "lucide-react";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";

const publicProjects = projects.filter((project) => project.links.some((link) => link.kind === "repository"));

export function OpenSource() {
  return (
    <section className="section section-tinted" aria-labelledby="open-source-title">
      <div className="shell open-source-grid">
        <SectionHeading
          eyebrow="GitHub / Open source"
          titleId="open-source-title"
          title="Public code, curated locally."
          description="The portfolio links to relevant public repositories without relying on live follower counts or rate-limited profile requests."
        />
        <div className="repo-card" data-scroll-reveal>
          <div className="repo-card-top">
            <GitFork aria-hidden="true" size={27} />
            <a href={profile.github} target="_blank" rel="noreferrer">
              github.com/CL4Y0101 <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          </div>
          <ul>
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
      </div>
    </section>
  );
}
