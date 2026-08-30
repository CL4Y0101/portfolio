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
          title="A stack organized by how it is used."
          description="No proficiency percentages—primary tools are emphasized through current work, while supporting and exploratory tools stay in context."
        />

        <CapabilityExplorer groups={skillGroups} />
      </div>
    </section>
  );
}
