import { GameMenuButton } from "@/components/game-menu/GameMenuButton";
import { GameIcon } from "@/components/game-ui/GameIcon";
import { GlassPanel } from "@/components/game-ui/GlassPanel";

export function ExitPrompt({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  return (
    <GlassPanel className="game-panel exit-menu-panel" aria-labelledby="menu-exit-title">
      <div className="exit-menu-icon"><GameIcon name="oak-door" size="2xl" /></div>
      <p className="exit-menu-kicker">SESSION NOTICE / EXIT REQUESTED</p>
      <h2 id="menu-exit-title">Leaving already?</h2>
      <p id="menu-exit-description">
        There is no game to quit here. This is a developer portfolio—choose Start portfolio to explore the projects and experience behind it.
      </p>
      <div className="exit-menu-actions">
        <GameMenuButton icon="diamond" variant="primary" onClick={onStart}>Start portfolio</GameMenuButton>
        <GameMenuButton icon="arrow" onClick={onBack}>Stay on menu</GameMenuButton>
      </div>
      <p className="exit-menu-hint">Press Esc to return to the main menu.</p>
    </GlassPanel>
  );
}
