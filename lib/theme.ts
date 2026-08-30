export type Theme = "light" | "dark";

const storageKey = "portfolio-theme";
export const themeChangeEvent = "portfolio-theme-change";

export function getCurrentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // The visual theme can still change when storage is unavailable.
  }

  window.dispatchEvent(new CustomEvent(themeChangeEvent, { detail: theme }));
}

export function toggleTheme() {
  const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  return nextTheme;
}
