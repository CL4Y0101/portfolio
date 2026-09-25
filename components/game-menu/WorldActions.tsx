"use client";

import { LocalizedText } from "@/components/ui/LocalizedText";
import { openMainMenuEvent } from "@/lib/preferences";

export function WorldActions() {
  return <nav className="world-actions" aria-label="World navigation">
    <a className="button button-secondary" href="#home"><LocalizedText en="Return to spawn" id="Kembali ke awal" /></a>
    <a className="button button-secondary" href="#project-gallery"><LocalizedText en="Explore projects" id="Jelajahi proyek" /></a>
    <button className="button button-secondary" type="button" onClick={() => window.dispatchEvent(new Event(openMainMenuEvent))}><LocalizedText en="Open main menu" id="Buka menu utama" /></button>
  </nav>;
}
