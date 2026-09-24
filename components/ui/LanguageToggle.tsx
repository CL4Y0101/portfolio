"use client";

import { setLanguage } from "@/lib/language";
import { useLanguage } from "@/components/ui/useLanguage";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const language = useLanguage();

  return (
    <div className={`language-toggle ${className}`.trim()} role="group" aria-label="Language / Bahasa">
      <button type="button" data-game-focusable aria-label="English" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
      <button type="button" data-game-focusable aria-label="Bahasa Indonesia" aria-pressed={language === "id"} onClick={() => setLanguage("id")}>ID</button>
    </div>
  );
}
