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
          title="Development work that reaches past the editor."
          description="Current responsibilities include product interfaces, application data, release environments, and the operational work needed to keep web systems available."
        />

        <ExperienceTimeline items={experience} />
      </div>
    </section>
  );
}
