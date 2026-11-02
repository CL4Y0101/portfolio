import { applyTheme, getThemePreference, type ThemePreference } from "@/lib/theme";

export type MotionPreference = "full" | "reduced" | "minimal" | "off";
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

/** The portfolio landing lives on its own route; the root route is the main menu page. */
export const portfolioPath = "/portfolio";
/** Session flag: the visitor explicitly asked for the menu (compass, world actions), so the menu page must not auto-skip to the portfolio. */
export const mainMenuOpenRequestKey = "portfolio-open-main-menu-request";
/** Session flag: after a first entry, the portfolio page should move focus to the hero title. */
export const heroFocusRequestKey = "portfolio-focus-hero";

export function requestMainMenuOpen() {
  try {
    window.sessionStorage.setItem(mainMenuOpenRequestKey, "1");
  } catch {
    // Storage unavailable: the menu page still opens, it just may auto-skip for returning visitors.
  }
}

export const defaultGamePreferences: GamePreferences = {
  theme: "system",
  motion: "full",
  sound: false,
  graphics: "balanced",
};

function isMotionPreference(value: unknown): value is MotionPreference {
  return value === "full" || value === "reduced" || value === "minimal" || value === "off";
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
  root.dataset.motion = new URLSearchParams(window.location.search).get("motion") === "off" ? "off"
    : preferences.motion === "full" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : preferences.motion;
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
