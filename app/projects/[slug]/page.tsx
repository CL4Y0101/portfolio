import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { CaseStudyNavigation } from "@/components/case-study/CaseStudyNavigation";
import { ProjectTechnologyExplorer } from "@/components/projects/ProjectTechnologyExplorer";
import { projects, getProject } from "@/data/projects";
import { SITE_URL } from "@/lib/constants";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

const caseStudySections = [
  { id: "overview", label: "Overview" },
  { id: "contribution", label: "Contribution" },
  { id: "technology", label: "Technology" },
  { id: "challenges", label: "Challenges" },
  { id: "results", label: "Results" },
];

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  const image = project.screenshots[0]?.src.replace(/^\/portfolio/, "") ?? "/images/projects/kandu-production.png";

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `${SITE_URL}/projects/${project.slug}/` },
    openGraph: {
      title: project.title,
      description: project.description,
      url: `${SITE_URL}/projects/${project.slug}/`,
      type: "article",
      images: [{ url: image, alt: project.screenshots[0]?.alt ?? `${project.title} case study` }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return (
    <main id="main-content" className="case-study">
      <ReadingProgress />
      <header className="case-hero">
        <div className="shell case-hero-grid">
          <div>
            <Link className="back-link" href="/#work">
              <ArrowLeft aria-hidden="true" size={16} /> Back to selected work
            </Link>
            <div className="case-badges">
              <Badge tone={project.status === "production" ? "live" : project.status === "in-progress" ? "warm" : "default"}>
                {project.statusLabel}
              </Badge>
              <span>{project.categories.join(" · ")}</span>
            </div>
            <h1>{project.title}</h1>
            <p className="case-subtitle">{project.subtitle}</p>
          </div>

          <dl className="case-facts">
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Period</dt>
              <dd>{project.period}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>{project.technologies.slice(0, 5).join(" · ")}</dd>
            </div>
          </dl>
        </div>

        <div className="shell case-links">
          {project.links.map((link) => (
            <a key={link.label} className="button button-secondary" href={link.url} target="_blank" rel="noreferrer">
              {link.label} <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          ))}
          <CopyButton currentUrl label="Copy project URL" className="button button-secondary" />
        </div>
      </header>

      <CaseStudyNavigation sections={caseStudySections} />

      {project.screenshots[0] ? (
        <section className="shell case-cover" aria-label={`${project.title} screenshot`} data-scroll-reveal>
          <Image
            src={project.screenshots[0].src}
            alt={project.screenshots[0].alt}
            width={1440}
            height={1000}
            priority
            sizes="(max-width: 1200px) 100vw, 1160px"
          />
          <p>{project.screenshots[0].caption}</p>
        </section>
      ) : (
        <div className="shell case-no-cover" aria-label="Project media note" data-scroll-reveal>
          <span>Project media</span>
          <p>No verified project screenshot is published here. The public repository is linked for implementation evidence.</p>
        </div>
      )}

      <section className="section case-overview" id="overview">
        <div className="shell case-narrative" data-scroll-reveal>
          <div>
            <p className="eyebrow">Overview</p>
            <h2>What the project needed to solve.</h2>
          </div>
          <div className="case-problem-solution">
            <article>
              <span>01 · Problem</span>
              <p>{project.problem}</p>
            </article>
            <article>
              <span>02 · Solution</span>
              <p>{project.solution}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-tinted" id="contribution">
        <div className="shell case-content-grid" data-scroll-reveal>
          <div>
            <p className="eyebrow">Contribution</p>
            <h2>Responsibilities and shipped work.</h2>
            <p className="section-description">The wording reflects contribution and maintenance work without claiming sole ownership.</p>
          </div>
          <ul className="responsibility-list">
            {project.responsibilities.map((responsibility) => (
              <li key={responsibility}>
                <CheckCircle2 aria-hidden="true" size={19} />
                <span>{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section case-technology" id="technology">
        <div className="shell case-content-grid" data-scroll-reveal>
          <div>
            <p className="eyebrow">Technology</p>
            <h2>Trace the stack back to the work.</h2>
            <p className="section-description">Select a technology to see the projects where it is evidenced.</p>
          </div>
          <ProjectTechnologyExplorer project={project} projects={projects} />
        </div>
      </section>

      <section className="section section-tinted" id="challenges">
        <div className="shell">
          <div className="case-section-heading">
            <p className="eyebrow">Engineering areas</p>
            <h2>Challenges handled in context.</h2>
          </div>
          <div className="challenge-grid" data-scroll-reveal="stagger">
            {project.challenges.map((challenge, index) => (
              <article key={challenge.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{challenge.title}</h3>
                <p>{challenge.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section case-highlights" id="results">
        <div className="shell case-content-grid" data-scroll-reveal>
          <div>
            <p className="eyebrow">Highlights</p>
            <h2>What is evidenced by the work.</h2>
          </div>
          <ul className="evidence-list evidence-list-large">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
      </section>

      {project.screenshots.length > 1 ? (
        <section className="section">
          <div className="shell">
            <div className="case-section-heading">
              <p className="eyebrow">Project views</p>
              <h2>More from the product.</h2>
            </div>
            <div className="screenshot-grid" data-scroll-reveal="stagger">
              {project.screenshots.slice(1).map((screenshot) => (
                <figure key={screenshot.src}>
                  <Image src={screenshot.src} alt={screenshot.alt} width={1440} height={1100} sizes="(max-width: 900px) 100vw, 60vw" />
                  <figcaption>{screenshot.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="case-cta">
        <div className="shell" data-scroll-reveal>
          <p className="eyebrow">Next project</p>
          <h2>Explore the rest of the work.</h2>
          <Link className="button button-primary" href="/#work">
            View selected work <ExternalLink aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
