import { applyTheme, getThemePreference, type ThemePreference } from "@/lib/theme";

export type MotionPreference = "full" | "reduced" | "minimal";
export type GraphicsPreference = "high" | "balanced" | "low";

export type GamePreferences = {
  theme: ThemePreference;
  motion: MotionPreference;
  sound: boolean;
  graphics: GraphicsPreference;
};

export const gamePreferencesKey = "portfolio-game-preferences";
export const preferencesChangeEvent = "portfolio-preferences-change";
export const openMainMenuEvent = "portfolio-open-main-menu";

export const defaultGamePreferences: GamePreferences = {
  theme: "system",
  motion: "full",
  sound: false,
  graphics: "balanced",
};

function isMotionPreference(value: unknown): value is MotionPreference {
  return value === "full" || value === "reduced" || value === "minimal";
}

function isGraphicsPreference(value: unknown): value is GraphicsPreference {
  return value === "high" || value === "balanced" || value === "low";
}

export function readGamePreferences(): GamePreferences {
  const reducedBySystem = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let stored: Partial<GamePreferences> = {};

  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(gamePreferencesKey) ?? "{}");
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      stored = parsed as Partial<GamePreferences>;
    }
  } catch {
    // Invalid or unavailable storage falls back to safe defaults.
  }

  return {
    theme: getThemePreference(),
    motion: isMotionPreference(stored.motion) ? stored.motion : reducedBySystem ? "reduced" : "full",
    sound: typeof stored.sound === "boolean" ? stored.sound : false,
    graphics: isGraphicsPreference(stored.graphics) ? stored.graphics : "balanced",
  };
}

export function applyGamePreferences(preferences: GamePreferences) {
  const root = document.documentElement;
  applyTheme(preferences.theme);
  root.dataset.motion = preferences.motion;
  root.dataset.graphics = preferences.graphics;

  try {
    localStorage.setItem(gamePreferencesKey, JSON.stringify(preferences));
  } catch {
    // Preferences still apply for the current visit when storage is unavailable.
  }

  window.dispatchEvent(new CustomEvent(preferencesChangeEvent, { detail: preferences }));
  window.dispatchEvent(new Event("portfolio-motion-change"));
}

export function resetGamePreferences() {
  try {
    localStorage.removeItem(gamePreferencesKey);
    localStorage.removeItem("portfolio-theme");
  } catch {
    // Reset can still apply in memory when storage is unavailable.
  }

  const defaults: GamePreferences = {
    ...defaultGamePreferences,
    motion: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full",
  };
  applyGamePreferences(defaults);
  return defaults;
}
