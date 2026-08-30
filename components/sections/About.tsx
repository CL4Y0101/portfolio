import { education } from "@/data/education";
import { profile } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <section className="section section-tinted" id="about" aria-labelledby="about-title">
      <div className="shell about-grid">
        <SectionHeading
          eyebrow="About"
          titleId="about-title"
          title="Product thinking with a systems foundation."
          description="My work has moved from networks and computer systems toward full-stack product development, without losing the operational perspective that makes production debugging practical."
        />
        <div className="about-copy">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="shell education-wrap" id="education">
        <p className="eyebrow">Education</p>
        <div className="education-grid">
          {education.map((item) => (
            <article key={item.institution}>
              <span>{item.period ?? "Technical education"}</span>
              <h3>{item.institution}</h3>
              <strong>{item.program}</strong>
              {item.detail ? <p>{item.detail}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
