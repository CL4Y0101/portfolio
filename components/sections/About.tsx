import { education } from "@/data/education";
import { profile } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LocalizedText } from "@/components/ui/LocalizedText";

export function About() {
  return (
    <section className="section section-tinted" id="about" aria-labelledby="about-title">
      <div className="shell about-grid">
        <SectionHeading
          eyebrow="About"
          titleId="about-title"
          title="Product thinking, systems mindset."
          description="Software development shaped by a foundation in networking."
        />
        <div className="about-copy" data-scroll-reveal>
          {profile.about.map((paragraph) => (
            <p key={paragraph}><LocalizedText en={paragraph} /></p>
          ))}
        </div>
      </div>

      <div className="shell education-wrap" id="education" data-scroll-reveal="fade-up">
        <p className="eyebrow"><LocalizedText en="Education" /></p>
        <div className="education-grid" data-scroll-reveal="stagger">
          {education.map((item) => (
            <article key={item.institution}>
              <span><LocalizedText en={item.period ?? "Technical education"} /></span>
              <h3>{item.institution}</h3>
              <strong><LocalizedText en={item.program} /></strong>
              {item.detail ? <p><LocalizedText en={item.detail} /></p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
