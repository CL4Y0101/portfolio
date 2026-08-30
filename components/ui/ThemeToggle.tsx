"use client";

import { Moon, Sun } from "lucide-react";
import { toggleTheme } from "@/lib/theme";

export function ThemeToggle() {
  return (
    <button
      className="icon-button"
      type="button"
      onClick={() => toggleTheme()}
      aria-label="Switch between light and dark theme"
      title="Switch color theme"
    >
      <Moon className="theme-icon theme-moon" aria-hidden="true" size={19} />
      <Sun className="theme-icon theme-sun" aria-hidden="true" size={19} />
    </button>
  );
}
