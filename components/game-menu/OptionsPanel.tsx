import { ArrowLeft, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { GameMenuButton } from "@/components/game-menu/GameMenuButton";
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
    <section className="game-panel options-panel" aria-labelledby="options-title">
      <div className="game-panel-heading">
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
        description="Controls ambient clouds, fog, depth, and particles."
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
          className="option-sound-toggle"
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
        <GameMenuButton icon={ArrowLeft} onClick={onBack}>Back</GameMenuButton>
        <GameMenuButton icon={RotateCcw} variant="danger" onClick={onReset}>Reset preferences</GameMenuButton>
      </div>
    </section>
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
