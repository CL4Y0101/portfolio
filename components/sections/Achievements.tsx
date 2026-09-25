import { Award, GraduationCap, UsersRound } from "lucide-react";
import { achievements, leadership } from "@/data/achievements";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Milestone } from "@/components/motion/Milestone";

const achievementIcons = [Award, GraduationCap, GraduationCap];

export function Achievements() {
  return (
    <section id="achievements" className="section" aria-labelledby="achievements-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Achievements"
          titleId="achievements-title"
          title="Verified milestones."
          description="Results and formal credentials, kept specific."
        />

        <div className="achievements-grid" data-scroll-reveal="stagger">
          {achievements.map((achievement, index) => {
            const Icon = achievementIcons[index];
            return (
              <Milestone featured={achievement.featured} key={achievement.title}>
                <Icon aria-hidden="true" size={22} />
                <span><LocalizedText en={achievement.date ?? achievement.issuer} /></span>
                <h3><LocalizedText en={achievement.title} /></h3>
                <p><LocalizedText en={achievement.issuer} /></p>
                <strong><LocalizedText en={achievement.detail} /></strong>
              </Milestone>
            );
          })}
        </div>

        <article className="leadership-card" data-scroll-reveal>
          <UsersRound aria-hidden="true" size={24} />
          <div>
            <p className="eyebrow"><LocalizedText en="Leadership" /></p>
            <h3><LocalizedText en={leadership.title} /></h3>
            <span>{leadership.organization}</span>
          </div>
          <p><LocalizedText en={leadership.description} /></p>
        </article>
      </div>
    </section>
  );
}
