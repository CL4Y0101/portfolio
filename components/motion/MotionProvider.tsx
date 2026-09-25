"use client";

import { useEffect } from "react";
import { applyTheme, getThemePreference } from "@/lib/theme";
import { preferencesChangeEvent, readGamePreferences } from "@/lib/preferences";

export function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactMotion = window.matchMedia("(max-width: 820px), (pointer: coarse)");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

    const updatePolicy = () => {
      const disabled = new URLSearchParams(window.location.search).get("motion") === "off";
      const preferences = readGamePreferences();
      root.dataset.motion = disabled ? "off" : reducedMotion.matches && preferences.motion === "full" ? "reduced" : preferences.motion;
      root.dataset.graphics = preferences.graphics;
      root.dataset.motionIntensity = compactMotion.matches ? "compact" : "full";
      window.dispatchEvent(new Event("portfolio-motion-change"));
    };

    const updateSystemTheme = () => {
      if (getThemePreference() === "system") applyTheme("system");
    };

    updatePolicy();
    reducedMotion.addEventListener("change", updatePolicy);
    compactMotion.addEventListener("change", updatePolicy);
    systemTheme.addEventListener("change", updateSystemTheme);
    window.addEventListener(preferencesChangeEvent, updatePolicy);

    return () => {
      reducedMotion.removeEventListener("change", updatePolicy);
      compactMotion.removeEventListener("change", updatePolicy);
      systemTheme.removeEventListener("change", updateSystemTheme);
      window.removeEventListener(preferencesChangeEvent, updatePolicy);
    };
  }, []);

  return null;
}
