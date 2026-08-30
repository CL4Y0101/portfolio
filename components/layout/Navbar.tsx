"use client";

import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CommandPalette } from "@/components/navigation/CommandPalette";

const navigation = [
  { label: "Home", href: "/#home" },
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Skills", href: "/#skills" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

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
    <header className="site-header">
      <nav className="shell nav-shell" aria-label="Primary navigation">
        <Link className="site-brand" href="/#home" onClick={() => setIsOpen(false)}>
          <Image src={profile.profileImage} alt="" width={40} height={40} priority />
          <span>{profile.shortName}</span>
        </Link>

        <div className={`nav-links ${isOpen ? "nav-links-open" : ""}`} id="site-navigation">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={activeSection === item.href.split("#")[1] ? "nav-link-active" : ""}
              aria-current={activeSection === item.href.split("#")[1] ? "location" : undefined}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="nav-controls">
          <button className="command-trigger" type="button" onClick={openPalette} aria-label="Open command palette">
            <Search aria-hidden="true" size={17} />
            <span>Command</span>
            <kbd>Ctrl K</kbd>
          </button>
          <ThemeToggle />
          <button
            className="icon-button menu-button"
            type="button"
            aria-expanded={isOpen}
            aria-controls="site-navigation"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
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
