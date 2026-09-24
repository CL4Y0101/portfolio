export type Language = "en" | "id";

export const languageChangeEvent = "portfolio-language-change";

export function setLanguage(language: Language) {
  document.documentElement.dataset.language = language;
  document.documentElement.lang = language;
  try {
    localStorage.setItem("portfolio-language", language);
  } catch {
    // The in-memory choice still works when storage is unavailable.
  }
  window.dispatchEvent(new Event(languageChangeEvent));
}

export function getLanguage(): Language {
  if (typeof document === "undefined") return "en";
  return document.documentElement.dataset.language === "id" ? "id" : "en";
}
