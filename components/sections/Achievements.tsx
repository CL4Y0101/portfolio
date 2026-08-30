import { Award, GraduationCap, UsersRound } from "lucide-react";
import { achievements, leadership } from "@/data/achievements";
import { SectionHeading } from "@/components/ui/SectionHeading";

const achievementIcons = [Award, GraduationCap, GraduationCap];

export function Achievements() {
  return (
    <section id="achievements" className="section" aria-labelledby="achievements-title">
      <div className="shell">
        <SectionHeading
          eyebrow="Achievements"
          titleId="achievements-title"
          title="Verified milestones, kept specific."
          description="Results and formal competency evidence take priority over generic personality claims."
        />

        <div className="achievements-grid">
          {achievements.map((achievement, index) => {
            const Icon = achievementIcons[index];
            return (
              <article className={achievement.featured ? "achievement-featured" : ""} key={achievement.title}>
                <Icon aria-hidden="true" size={22} />
                <span>{achievement.date ?? achievement.issuer}</span>
                <h3>{achievement.title}</h3>
                <p>{achievement.issuer}</p>
                <strong>{achievement.detail}</strong>
              </article>
            );
          })}
        </div>

        <article className="leadership-card">
          <UsersRound aria-hidden="true" size={24} />
          <div>
            <p className="eyebrow">Leadership</p>
            <h3>{leadership.title}</h3>
            <span>{leadership.organization}</span>
          </div>
          <p>{leadership.description}</p>
        </article>
      </div>
    </section>
  );
}
