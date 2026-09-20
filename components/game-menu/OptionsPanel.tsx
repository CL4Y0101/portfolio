import { Volume2, VolumeX } from "lucide-react";
import { GameMenuButton } from "@/components/game-menu/GameMenuButton";
import { GlassPanel } from "@/components/game-ui/GlassPanel";
import ui from "@/components/game-ui/minecraft.module.css";
import type { GamePreferences, GraphicsPreference, MotionPreference } from "@/lib/preferences";
import type { ThemePreference } from "@/lib/theme";

type OptionsPanelProps = {
  preferences: GamePreferences;
  onBack: () => void;
  onChange: (preferences: GamePreferences) => void;
  onReset: () => void;
};

export function OptionsPanel({ preferences, onBack, onChange, onReset }: OptionsPanelProps) {
  return (
    <GlassPanel className="game-panel options-panel" aria-labelledby="options-title">
      <div className={`game-panel-heading ${ui.heading}`}>
        <div>
          <p>World settings</p>
          <h2 id="options-title">Options</h2>
        </div>
        <span>AUTO-SAVED</span>
      </div>

      <OptionGroup
        label="Theme"
        description="Choose the portfolio interface palette."
        options={["light", "dark", "system"] as ThemePreference[]}
        value={preferences.theme}
        onSelect={(theme) => onChange({ ...preferences, theme })}
      />
      <OptionGroup
        label="Motion"
        description="Reduced and Minimal remove parallax and world transitions."
        options={["full", "reduced", "minimal"] as MotionPreference[]}
        value={preferences.motion}
        onSelect={(motion) => onChange({ ...preferences, motion })}
      />
      <OptionGroup
        label="Graphics"
        description="High adds glass refraction on supported desktops. Balanced uses frosted panels; Low removes glass and ambient detail."
        options={["high", "balanced", "low"] as GraphicsPreference[]}
        value={preferences.graphics}
        onSelect={(graphics) => onChange({ ...preferences, graphics })}
      />

      <div className="option-row">
        <div>
          <strong>Sound cues</strong>
          <p>Optional procedural menu feedback. Off by default.</p>
        </div>
        <button
          className={`option-sound-toggle ${ui.control}`}
          data-game-focusable
          type="button"
          aria-pressed={preferences.sound}
          onClick={() => onChange({ ...preferences, sound: !preferences.sound })}
        >
          {preferences.sound ? <Volume2 aria-hidden="true" size={17} /> : <VolumeX aria-hidden="true" size={17} />}
          {preferences.sound ? "On" : "Off"}
        </button>
      </div>

      <div className="game-panel-actions">
        <GameMenuButton icon="arrow" onClick={onBack}>Back</GameMenuButton>
        <GameMenuButton icon="compass" variant="danger" onClick={onReset}>Reset preferences</GameMenuButton>
      </div>
    </GlassPanel>
  );
}

function OptionGroup<T extends string>({
  description,
  label,
  onSelect,
  options,
  value,
}: {
  description: string;
  label: string;
  onSelect: (value: T) => void;
  options: T[];
  value: T;
}) {
  return (
    <fieldset className="option-group">
      <legend>{label}</legend>
      <p>{description}</p>
      <div className="option-segments">
        {options.map((option) => (
          <button
            key={option}
            className={ui.control}
            data-game-focusable
            type="button"
            aria-pressed={value === option}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
