import { CheckCircle2 } from "lucide-react";
import { achievements, leadership } from "@/data/achievements";
import { GameMenuButton } from "@/components/game-menu/GameMenuButton";
import { GameIcon } from "@/components/game-ui/GameIcon";
import { GlassPanel } from "@/components/game-ui/GlassPanel";
import ui from "@/components/game-ui/minecraft.module.css";

export function AchievementsPanel({ onBack }: { onBack: () => void }) {
  return (
    <GlassPanel className="game-panel achievements-panel" aria-labelledby="menu-achievements-title">
      <div className={`game-panel-heading ${ui.heading}`}>
        <div>
          <p>Verified progress</p>
          <h2 id="menu-achievements-title">Achievements</h2>
        </div>
        <span>{achievements.length + 1} UNLOCKED</span>
      </div>

      <div className="menu-achievement-grid">
        {achievements.map((achievement, index) => (
          <article key={achievement.title} className={`${ui.slot} ${achievement.featured ? "menu-achievement-featured" : ""}`}>
            <div className="menu-achievement-icon"><GameIcon name="nether-star" /></div>
            <div>
              <span>Milestone {String(index + 1).padStart(2, "0")}</span>
              <h3>{achievement.title}</h3>
              <p>{achievement.issuer}</p>
              <strong>{achievement.date ?? achievement.detail}</strong>
            </div>
            <small><CheckCircle2 aria-hidden="true" size={14} /> Verified</small>
          </article>
        ))}
        <article className={ui.slot}>
          <div className="menu-achievement-icon"><GameIcon name="emerald" /></div>
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
        <GameMenuButton icon="arrow" onClick={onBack}>Back to main menu</GameMenuButton>
      </div>
    </GlassPanel>
  );
}
