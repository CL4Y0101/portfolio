import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { experience } from "@/data/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Experience() {
  return (
    <section className="section section-tinted" id="experience" aria-labelledby="experience-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Experience"
          titleId="experience-title"
          title="Experience in product and systems."
          description="Building interfaces, connecting data, and keeping products online."
        />

        <ExperienceTimeline items={experience} />
      </div>
    </section>
  );
}
