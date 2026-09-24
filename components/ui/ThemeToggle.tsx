"use client";

import { Moon, Sun } from "lucide-react";
import { toggleTheme } from "@/lib/theme";
import { useLanguage } from "@/components/ui/useLanguage";

export function ThemeToggle() {
  const language = useLanguage();
  return (
    <button
      className="icon-button"
      type="button"
      onClick={() => toggleTheme()}
      aria-label={language === "id" ? "Ganti tema terang dan gelap" : "Switch between light and dark theme"}
      title={language === "id" ? "Ganti tema" : "Switch color theme"}
    >
      <Moon className="theme-icon theme-moon" aria-hidden="true" size={19} />
      <Sun className="theme-icon theme-sun" aria-hidden="true" size={19} />
    </button>
  );
}
