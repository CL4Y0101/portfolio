"use client";

import { useEffect } from "react";
import { heroFocusRequestKey } from "@/lib/preferences";

/**
 * After a first entry from the menu page, move focus to the hero title,
 * mirroring the old same-page entry where the menu closed over the hero.
 * The menu sets the session flag right before navigating here.
 */
export function EntryFocus() {
  useEffect(() => {
    let requested = false;
    try {
      requested = window.sessionStorage.getItem(heroFocusRequestKey) === "1";
      if (requested) window.sessionStorage.removeItem(heroFocusRequestKey);
    } catch {
      // Storage unavailable: focus simply stays at the top of the page.
    }
    if (!requested) return;
    const frame = window.requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>("#hero-title");
      if (target && !target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }
      target?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return null;
}
