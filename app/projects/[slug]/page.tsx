import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { RevealText } from "@/components/ui/RevealText";
import { CaseStudyNavigation } from "@/components/case-study/CaseStudyNavigation";
import { ProjectTechnologyExplorer } from "@/components/projects/ProjectTechnologyExplorer";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { projectCopyId } from "@/data/project-copy-id";
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
    alternates: { canonical: `${SITE_URL}/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.description,
      url: `${SITE_URL}/projects/${project.slug}`,
      type: "article",
      images: [{ url: image, alt: project.screenshots[0]?.alt ?? `${project.title} case study` }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const copy = projectCopyId[project.slug];

  return (
    <main id="main-content" className="case-study" data-case-entry>
      <ReadingProgress />
      <header className="case-hero">
        <div className="shell case-hero-grid">
          <div className="case-hero-copy">
            <Link className="back-link" href="/#work">
              <ArrowLeft aria-hidden="true" size={16} /> <LocalizedText en="Back to selected work" />
            </Link>
            <div className="case-badges">
              <Badge tone={project.status === "production" ? "live" : project.status === "in-progress" ? "warm" : "default"}>
                <LocalizedText en={project.statusLabel} />
              </Badge>
              <span>{project.categories.map((category, index) => <span key={category}>{index ? " · " : ""}<LocalizedText en={category} /></span>)}</span>
            </div>
            <RevealText as="h1" text={project.title} mode="entrance" delay={120} />
            <p className="case-subtitle"><LocalizedText en={project.subtitle} id={copy?.subtitle} /></p>
          </div>

          <dl className="case-facts" data-scroll-reveal="stagger">
            <div>
              <dt><LocalizedText en="Role" /></dt>
              <dd><LocalizedText en={project.role} id={copy?.role} /></dd>
            </div>
            <div>
              <dt><LocalizedText en="Period" /></dt>
              <dd><LocalizedText en={project.period} /></dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>{project.technologies.slice(0, 5).join(" · ")}</dd>
            </div>
          </dl>
        </div>

        <div className="shell case-links" data-scroll-reveal="fade-up">
          {project.links.map((link, index) => (
            <a key={link.label} className="button button-secondary" href={link.url} target="_blank" rel="noreferrer">
              <LocalizedText en={link.label} id={copy?.linkLabels[index]} /> <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          ))}
          <CopyButton currentUrl label="Copy project URL" className="button button-secondary" />
        </div>
      </header>

      <CaseStudyNavigation sections={caseStudySections} />

      {project.screenshots[0] ? (
        <section className="shell case-cover" aria-label={`${project.title} screenshot`} data-scroll-reveal="portal">
          <Image
            src={project.screenshots[0].src}
            alt={project.screenshots[0].alt}
            width={1440}
            height={1000}
            priority
            sizes="(max-width: 1200px) 100vw, 1160px"
          />
          <p><LocalizedText en={project.screenshots[0].caption} id={copy?.screenshotCaptions[0]} /></p>
        </section>
      ) : (
        <div className="shell case-no-cover" aria-label="Project media note" data-scroll-reveal="portal">
          <span><LocalizedText en="Project media" /></span>
          <p><LocalizedText en="No verified project screenshot is published here. The public repository is linked for implementation evidence." /></p>
        </div>
      )}

      <section className="section case-overview" id="overview">
        <div className="shell case-narrative" data-scroll-reveal="block-wipe">
          <div>
            <p className="eyebrow"><LocalizedText en="Overview" /></p>
            <RevealText text="What the project needed to solve." />
          </div>
          <div className="case-problem-solution">
            <article>
              <span>01 · <LocalizedText en="Problem" /></span>
              <p><LocalizedText en={project.problem} id={copy?.problem} /></p>
            </article>
            <article>
              <span>02 · <LocalizedText en="Solution" /></span>
              <p><LocalizedText en={project.solution} id={copy?.solution} /></p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-tinted" id="contribution">
        <div className="shell case-content-grid" data-scroll-reveal>
          <div>
            <p className="eyebrow"><LocalizedText en="Contribution" /></p>
            <RevealText text="Responsibilities and shipped work." />
            <p className="section-description"><LocalizedText en="Contributions are described without claiming sole ownership." /></p>
          </div>
          <ul className="responsibility-list" data-scroll-reveal="stagger">
            {project.responsibilities.map((responsibility, index) => (
              <li key={responsibility}>
                <CheckCircle2 aria-hidden="true" size={19} />
                <span><LocalizedText en={responsibility} id={copy?.responsibilities[index]} /></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section case-technology" id="technology">
        <div className="shell case-content-grid" data-scroll-reveal>
          <div>
            <p className="eyebrow"><LocalizedText en="Technology" /></p>
            <RevealText text="Trace the stack back to the work." />
            <p className="section-description"><LocalizedText en="Select a technology to see where it was used." /></p>
          </div>
          <ProjectTechnologyExplorer project={project} projects={projects} />
        </div>
      </section>

      <section className="section section-tinted" id="challenges">
        <div className="shell">
          <div className="case-section-heading" data-scroll-reveal="block-wipe">
            <p className="eyebrow"><LocalizedText en="Engineering areas" /></p>
            <RevealText text="Challenges handled in context." />
          </div>
          <div className="challenge-grid" data-scroll-reveal="stagger">
            {project.challenges.map((challenge, index) => (
              <article key={challenge.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3><LocalizedText en={challenge.title} id={copy?.challenges[index]?.title} /></h3>
                <p><LocalizedText en={challenge.description} id={copy?.challenges[index]?.description} /></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section case-highlights" id="results">
        <div className="shell case-content-grid" data-scroll-reveal>
          <div>
            <p className="eyebrow"><LocalizedText en="Highlights" /></p>
            <RevealText text="What is evidenced by the work." />
          </div>
          <ul className="evidence-list evidence-list-large">
            {project.highlights.map((highlight, index) => (
              <li key={highlight}><LocalizedText en={highlight} id={copy?.highlights[index]} /></li>
            ))}
          </ul>
        </div>
      </section>

      {project.screenshots.length > 1 ? (
        <section className="section">
          <div className="shell">
            <div className="case-section-heading">
              <p className="eyebrow"><LocalizedText en="Project views" /></p>
              <RevealText text="More from the product." />
            </div>
            <div className="screenshot-grid" data-scroll-reveal="stagger">
              {project.screenshots.slice(1).map((screenshot, index) => (
                <figure key={screenshot.src}>
                  <Image src={screenshot.src} alt={screenshot.alt} width={1440} height={1100} sizes="(max-width: 900px) 100vw, 60vw" />
                  <figcaption><LocalizedText en={screenshot.caption} id={copy?.screenshotCaptions[index + 1]} /></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="case-cta">
        <div className="shell" data-scroll-reveal="portal">
          <p className="eyebrow"><LocalizedText en="Next project" /></p>
          <RevealText text="Explore the rest of the work." />
          <p className="case-cta-description"><LocalizedText en="Next up" />: {nextProject.title}. <LocalizedText en="Or return to all selected projects." /></p>
          <div className="case-cta-actions">
            <Link className="button button-primary" href={`/projects/${nextProject.slug}`} prefetch={false}>
              <LocalizedText en="Next case study" /> <ExternalLink aria-hidden="true" size={16} />
            </Link>
            <Link className="button button-secondary" href="/#work">
              <LocalizedText en="View selected work" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
