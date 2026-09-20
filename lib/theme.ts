export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

const storageKey = "portfolio-theme";
export const themeChangeEvent = "portfolio-theme-change";

export function getThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {
    // System preference remains available when storage is unavailable.
  }

  return "system";
}

function resolveTheme(preference: ThemePreference): Theme {
  if (preference !== "system") return preference;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getCurrentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function applyTheme(preference: ThemePreference) {
  const theme = resolveTheme(preference);
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.style.colorScheme = theme;

  try {
    localStorage.setItem(storageKey, preference);
  } catch {
    // The visual theme can still change when storage is unavailable.
  }

  window.dispatchEvent(new CustomEvent(themeChangeEvent, { detail: { preference, theme } }));
}

export function toggleTheme() {
  const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  return nextTheme;
}
