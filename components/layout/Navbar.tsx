"use client";

import { Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { GameIcon } from "@/components/game-ui/GameIcon";
import ui from "@/components/game-ui/minecraft.module.css";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const collapsedRef = useRef(false);
  const navShellRef = useRef<HTMLElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const expandButtonRef = useRef<HTMLButtonElement>(null);

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
    let lastScrollY = window.scrollY;
    let collapsePeak = lastScrollY;
    let canCollapse = false;
    const compactViewport = window.matchMedia("(max-width: 1100px), (pointer: coarse)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const expand = () => {
      collapsedRef.current = false;
      setIsCollapsed(false);
      if (document.activeElement === expandButtonRef.current) {
        window.requestAnimationFrame(() => navLinksRef.current?.querySelector("a")?.focus());
      }
    };

    const updatePolicy = () => {
      canCollapse = !compactViewport.matches && !reducedMotion.matches && document.documentElement.dataset.motion === "full";
      if (!canCollapse) expand();
    };

    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const currentScrollY = window.scrollY;
        setIsScrolled(currentScrollY > 12);

        if (currentScrollY <= 150) {
          if (collapsedRef.current) expand();
        } else if (canCollapse) {
          const keyboardFocusInNav = navShellRef.current?.contains(document.activeElement) && document.activeElement?.matches(":focus-visible");
          if (!collapsedRef.current && currentScrollY > lastScrollY && !keyboardFocusInNav) {
            collapsedRef.current = true;
            collapsePeak = currentScrollY;
            setIsCollapsed(true);
          } else if (collapsedRef.current) {
            collapsePeak = Math.max(collapsePeak, currentScrollY);
            if (collapsePeak - currentScrollY > 80) expand();
          }
        }

        lastScrollY = currentScrollY;
      });
    };

    updatePolicy();
    update();
    window.addEventListener("scroll", update, { passive: true });
    compactViewport.addEventListener("change", updatePolicy);
    reducedMotion.addEventListener("change", updatePolicy);
    window.addEventListener("portfolio-motion-change", updatePolicy);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      compactViewport.removeEventListener("change", updatePolicy);
      reducedMotion.removeEventListener("change", updatePolicy);
      window.removeEventListener("portfolio-motion-change", updatePolicy);
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      collapsedRef.current = false;
      setIsCollapsed(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

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
  }, [pathname]);

  return (
    <header className={`site-header ${ui.hud}`} data-scrolled={isScrolled ? "true" : "false"} data-world-entry>
      <nav className="shell nav-shell" ref={navShellRef} data-collapsed={isCollapsed ? "true" : "false"} aria-label="Primary navigation">
        <Link className="site-brand" href="/#home" inert={isCollapsed} aria-hidden={isCollapsed || undefined} onClick={() => setIsOpen(false)}>
          <span className="brand-avatar"><Image src={profile.profileImage} alt="" width={40} height={40} priority /></span>
          <span className="brand-copy">
            <strong>{profile.shortName}</strong>
            <small>WORLD / PORTFOLIO</small>
          </span>
        </Link>

        <div className={`nav-links ${isOpen ? "nav-links-open" : ""}`} id="site-navigation">
          <div className="nav-link-list" id="site-navigation-items" ref={navLinksRef} inert={isCollapsed} aria-hidden={isCollapsed || undefined}>
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
        </div>

        <div className="nav-controls" inert={isCollapsed} aria-hidden={isCollapsed || undefined}>
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
        <button
          ref={expandButtonRef}
          className="nav-expand-button"
          type="button"
          aria-label={label("Open navigation menu")}
          aria-controls="site-navigation-items"
          aria-expanded={!isCollapsed}
          aria-hidden={!isCollapsed || undefined}
          tabIndex={isCollapsed ? 0 : -1}
          onClick={() => {
            collapsedRef.current = false;
            setIsCollapsed(false);
            window.requestAnimationFrame(() => navLinksRef.current?.querySelector("a")?.focus());
          }}
        >
          <Menu aria-hidden="true" size={20} />
        </button>
      </nav>
      <CommandPalette open={paletteOpen} onOpen={openPalette} onClose={() => setPaletteOpen(false)} />
    </header>
  );
}
