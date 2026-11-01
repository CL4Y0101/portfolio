import { Award, GraduationCap, Medal, Trophy, UsersRound } from "lucide-react";
import { achievementArchives, achievements, leadership } from "@/data/achievements";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { GlassFolder } from "@/components/ui/glass-folder-cards";
import { Milestone } from "@/components/motion/Milestone";

const achievementIcons = [Trophy, Award, GraduationCap, GraduationCap, Medal];

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

        <div className="archive-block" data-scroll-reveal>
          <h3 className="archive-title"><LocalizedText en="Achievement archive." /></h3>
          <p className="archive-description">
            <LocalizedText en="Certificates and photos, filed per event. Open a folder to browse its files." />
          </p>
          <div className="archive-folders">
            {achievementArchives.map((archive, index) => (
              <GlassFolder
                key={archive.label.en}
                label={archive.label}
                meta={archive.meta}
                status={archive.status}
                tone={archive.tone}
                cover={archive.cover}
                files={archive.files}
                appearDelay={index * 150}
              />
            ))}
          </div>
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
