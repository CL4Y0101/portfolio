"use client";

import { Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { GameIcon } from "@/components/game-ui/GameIcon";
import ui from "@/components/game-ui/minecraft.module.css";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { useLanguage } from "@/components/ui/useLanguage";
import { translate } from "@/lib/translations";
import { CommandPalette } from "@/components/navigation/CommandPalette";
import { openMainMenuEvent } from "@/lib/preferences";

const navigation = [
  { label: "Home", href: "/#home" },
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Skills", href: "/#skills" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const language = useLanguage();
  const label = (en: string) => language === "id" ? translate(en) : en;
  const [isOpen, setIsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const openPalette = useCallback(() => {
    setIsOpen(false);
    setPaletteOpen(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", isOpen);
    return () => document.body.classList.remove("menu-open");
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setIsScrolled(window.scrollY > 12));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.href.split("#")[1]))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -68%", threshold: [0, 0.1, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`site-header ${ui.hud}`} data-scrolled={isScrolled ? "true" : "false"} data-world-entry>
      <nav className="shell nav-shell" aria-label="Primary navigation">
        <Link className="site-brand" href="/#home" onClick={() => setIsOpen(false)}>
          <span className="brand-avatar"><Image src={profile.profileImage} alt="" width={40} height={40} priority /></span>
          <span className="brand-copy">
            <strong>{profile.shortName}</strong>
            <small>WORLD / PORTFOLIO</small>
          </span>
        </Link>

        <div className={`nav-links ${isOpen ? "nav-links-open" : ""}`} id="site-navigation">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${ui.hudLink} ${activeSection === item.href.split("#")[1] ? "nav-link-active" : ""}`}
              aria-current={activeSection === item.href.split("#")[1] ? "location" : undefined}
              onClick={() => setIsOpen(false)}
            >
              <span className="nav-slot-marker" aria-hidden="true" />
              <LocalizedText en={item.label} />
            </Link>
          ))}
        </div>

        <div className="nav-controls">
          {pathname === "/" ? <button
            className="icon-button main-menu-trigger"
            type="button"
            onClick={() => window.dispatchEvent(new Event(openMainMenuEvent))}
            aria-label={label("Open portfolio main menu")}
            title={label("Open main menu")}
          >
            <GameIcon name="compass" />
          </button> : <Link className="icon-button main-menu-trigger" href="/" aria-label={label("Return to portfolio")} title={label("Return to portfolio")}>
            <GameIcon name="compass" />
          </Link>}
          <button className="command-trigger" type="button" onClick={openPalette} aria-label={label("Open command palette")}>
            <Search aria-hidden="true" size={17} />
            <span><LocalizedText en="Command" /></span>
            <kbd>Ctrl K</kbd>
          </button>
          <LanguageToggle />
          <ThemeToggle />
          <button
            className="icon-button menu-button"
            type="button"
            aria-expanded={isOpen}
            aria-controls="site-navigation"
            aria-label={label(isOpen ? "Close navigation menu" : "Open navigation menu")}
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </nav>
      <CommandPalette open={paletteOpen} onOpen={openPalette} onClose={() => setPaletteOpen(false)} />
    </header>
  );
}
