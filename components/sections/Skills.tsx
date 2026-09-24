import { skillGroups } from "@/data/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CapabilityExplorer } from "@/components/skills/CapabilityExplorer";

export function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Technical capabilities"
          titleId="skills-title"
          title="Tools behind the work."
          description="A practical stack, organized by how I use it."
        />

        <CapabilityExplorer groups={skillGroups} />
      </div>
    </section>
  );
}
