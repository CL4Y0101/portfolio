import { CheckCircle2 } from "lucide-react";
import { achievements, leadership } from "@/data/achievements";
import { GameMenuButton } from "@/components/game-menu/GameMenuButton";
import { GameIcon } from "@/components/game-ui/GameIcon";
import { GlassPanel } from "@/components/game-ui/GlassPanel";
import ui from "@/components/game-ui/minecraft.module.css";
import { LocalizedText } from "@/components/ui/LocalizedText";

export function AchievementsPanel({ onBack }: { onBack: () => void }) {
  return (
    <GlassPanel className="game-panel achievements-panel" aria-labelledby="menu-achievements-title">
      <div className={`game-panel-heading ${ui.heading}`}>
        <div>
          <p><LocalizedText en="Verified progress" /></p>
          <h2 id="menu-achievements-title"><LocalizedText en="Achievements" /></h2>
        </div>
        <span>{achievements.length + 1} UNLOCKED</span>
      </div>

      <div className="menu-achievement-grid">
        {achievements.map((achievement, index) => (
          <article key={achievement.title} className={`${ui.slot} ${achievement.featured ? "menu-achievement-featured" : ""}`}>
            <div className="menu-achievement-icon"><GameIcon name="nether-star" /></div>
            <div>
              <span><LocalizedText en="Milestone" /> {String(index + 1).padStart(2, "0")}</span>
              <h3><LocalizedText en={achievement.title} /></h3>
              <p><LocalizedText en={achievement.issuer} /></p>
              <strong><LocalizedText en={achievement.date ?? achievement.detail} /></strong>
            </div>
            <small><CheckCircle2 aria-hidden="true" size={14} /> <LocalizedText en="Verified" /></small>
          </article>
        ))}
        <article className={ui.slot}>
          <div className="menu-achievement-icon"><GameIcon name="emerald" /></div>
          <div>
            <span><LocalizedText en="Leadership" /></span>
            <h3><LocalizedText en={leadership.title} /></h3>
            <p>{leadership.organization}</p>
            <strong><LocalizedText en={leadership.description} /></strong>
          </div>
          <small><CheckCircle2 aria-hidden="true" size={14} /> <LocalizedText en="Current" /></small>
        </article>
      </div>

      <div className="game-panel-actions">
        <GameMenuButton icon="arrow" onClick={onBack}><LocalizedText en="Back to main menu" /></GameMenuButton>
      </div>
    </GlassPanel>
  );
}
