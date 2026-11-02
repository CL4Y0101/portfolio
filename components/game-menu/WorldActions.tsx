"use client";

import Link from "next/link";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { requestMainMenuOpen } from "@/lib/preferences";

export function WorldActions() {
  return <nav className="world-actions" aria-label="World navigation">
    <a className="button button-secondary" href="#home"><LocalizedText en="Return to spawn" id="Kembali ke awal" /></a>
    <a className="button button-secondary" href="#project-gallery"><LocalizedText en="Explore projects" id="Jelajahi proyek" /></a>
    <Link className="button button-secondary" href="/" onClick={() => requestMainMenuOpen()}><LocalizedText en="Open main menu" id="Buka menu utama" /></Link>
  </nav>;
}
