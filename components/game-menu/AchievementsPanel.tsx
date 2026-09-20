import { ArrowLeft, CheckCircle2, Trophy, UsersRound } from "lucide-react";
import { achievements, leadership } from "@/data/achievements";
import { GameMenuButton } from "@/components/game-menu/GameMenuButton";

export function AchievementsPanel({ onBack }: { onBack: () => void }) {
  return (
    <section className="game-panel achievements-panel" aria-labelledby="menu-achievements-title">
      <div className="game-panel-heading">
        <div>
          <p>Verified progress</p>
          <h2 id="menu-achievements-title">Achievements</h2>
        </div>
        <span>{achievements.length + 1} UNLOCKED</span>
      </div>

      <div className="menu-achievement-grid">
        {achievements.map((achievement, index) => (
          <article key={achievement.title} className={achievement.featured ? "menu-achievement-featured" : ""}>
            <div className="menu-achievement-icon"><Trophy aria-hidden="true" size={21} /></div>
            <div>
              <span>Milestone {String(index + 1).padStart(2, "0")}</span>
              <h3>{achievement.title}</h3>
              <p>{achievement.issuer}</p>
              <strong>{achievement.date ?? achievement.detail}</strong>
            </div>
            <small><CheckCircle2 aria-hidden="true" size={14} /> Verified</small>
          </article>
        ))}
        <article>
          <div className="menu-achievement-icon"><UsersRound aria-hidden="true" size={21} /></div>
          <div>
            <span>Leadership</span>
            <h3>{leadership.title}</h3>
            <p>{leadership.organization}</p>
            <strong>{leadership.description}</strong>
          </div>
          <small><CheckCircle2 aria-hidden="true" size={14} /> Current</small>
        </article>
      </div>

      <div className="game-panel-actions">
        <GameMenuButton icon={ArrowLeft} onClick={onBack}>Back to main menu</GameMenuButton>
      </div>
    </section>
  );
}
