"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AboutPanel } from "@/components/game-menu/AboutPanel";
import { AchievementsPanel } from "@/components/game-menu/AchievementsPanel";
import { ExitPrompt } from "@/components/game-menu/ExitPrompt";
import { GameMenuButton } from "@/components/game-menu/GameMenuButton";
import { useMenuFocusManager } from "@/components/game-menu/MenuFocusManager";
import { OptionsPanel } from "@/components/game-menu/OptionsPanel";
import { WorldBackground } from "@/components/game-menu/WorldBackground";
import { GlassPanel } from "@/components/game-ui/GlassPanel";
import { motionDurations } from "@/components/motion/motion";
import { RevealText } from "@/components/ui/RevealText";
import { profile } from "@/data/profile";
import {
  applyGamePreferences,
  defaultGamePreferences,
  openMainMenuEvent,
  readGamePreferences,
  resetGamePreferences,
  type GamePreferences,
} from "@/lib/preferences";

type MenuPanel = "main" | "options" | "achievements" | "about" | "exit";
type MenuState = "active" | "entering";
type MenuAction = "start" | "options" | "achievements" | "about" | "exit";

export function MainMenuScreen() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const pendingFocusRef = useRef<"hero" | "previous" | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);
  const [panel, setPanel] = useState<MenuPanel>("main");
  const [menuState, setMenuState] = useState<MenuState>("active");
  const [selectedAction, setSelectedAction] = useState<MenuAction>("start");
  const [preferences, setPreferences] = useState<GamePreferences>(defaultGamePreferences);
  const [paused, setPaused] = useState(false);
  const onHomepage = pathname === "/";
  const active = onHomepage && visible;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedPreferences = readGamePreferences();
      setPreferences(storedPreferences);
      applyGamePreferences(storedPreferences);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handleVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    const handleOpenMenu = () => {
      if (!onHomepage) return;
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setPreferences(readGamePreferences());
      setHasEntered(true);
      setPanel("main");
      setSelectedAction("start");
      setMenuState("active");
      setVisible(true);
    };

    window.addEventListener(openMainMenuEvent, handleOpenMenu);
    return () => window.removeEventListener(openMainMenuEvent, handleOpenMenu);
  }, [onHomepage]);

  useEffect(() => {
    if (!active) return;
    const siblings = Array.from(document.body.children).filter((element) => !element.classList.contains("main-menu-root"));
    siblings.forEach((element) => { (element as HTMLElement).inert = true; });
    document.body.classList.add("game-menu-open");

    return () => {
      siblings.forEach((element) => { (element as HTMLElement).inert = false; });
      document.body.classList.remove("game-menu-open");
    };
  }, [active]);

  useEffect(() => {
    if (active || !pendingFocusRef.current) return;
    const pendingFocus = pendingFocusRef.current;
    pendingFocusRef.current = null;
    const frame = window.requestAnimationFrame(() => {
      const focusTarget = pendingFocus === "previous"
        ? returnFocusRef.current
        : document.querySelector<HTMLElement>("#hero-title");
      if (focusTarget && pendingFocus === "hero" && !focusTarget.hasAttribute("tabindex")) {
        focusTarget.setAttribute("tabindex", "-1");
      }
      focusTarget?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [active]);

  useEffect(() => () => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
  }, []);

  const playTick = useCallback(() => {
    if (!preferences.sound) return;
    try {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(170, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(110, context.currentTime + 0.045);
      gain.gain.setValueAtTime(0.018, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.05);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.05);
      oscillator.addEventListener("ended", () => void context.close(), { once: true });
    } catch {
      // Sound feedback is optional and never blocks navigation.
    }
  }, [preferences.sound]);

  const enterPortfolio = useCallback((restorePreviousFocus = false) => {
    playTick();
    setHasEntered(true);
    setMenuState("entering");
    const reduced = preferences.motion !== "full" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? motionDurations.instant : motionDurations.page;

    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      pendingFocusRef.current = restorePreviousFocus ? "previous" : "hero";
      setVisible(false);
      setMenuState("active");
      setPanel("main");
    }, duration);
  }, [playTick, preferences.motion]);

  const openPanel = useCallback((nextPanel: MenuPanel) => {
    playTick();
    setPanel(nextPanel);
  }, [playTick]);

  const backToMain = useCallback(() => {
    playTick();
    setPanel("main");
    setSelectedAction("start");
  }, [playTick]);

  const handleEscape = useCallback(() => {
    if (panel !== "main") backToMain();
    else if (hasEntered) enterPortfolio(true);
    else openPanel("exit");
  }, [backToMain, enterPortfolio, hasEntered, openPanel, panel]);

  useMenuFocusManager(containerRef, active, panel, handleEscape);

  const updatePreferences = useCallback((nextPreferences: GamePreferences) => {
    setPreferences(nextPreferences);
    applyGamePreferences(nextPreferences);
  }, []);

  const resetPreferences = useCallback(() => {
    const defaults = resetGamePreferences();
    setPreferences(defaults);
  }, []);

  if (!active) return null;

  return (
    <section
      ref={containerRef}
      className="main-menu-root"
      data-state={menuState}
      data-panel={panel}
      role="dialog"
      aria-modal="true"
      aria-labelledby={panel === "main"
        ? "main-menu-title"
        : panel === "options"
          ? "options-title"
          : panel === "achievements"
            ? "menu-achievements-title"
            : panel === "about"
              ? "menu-about-title"
              : "menu-exit-title"}
      aria-describedby={panel === "exit" ? "menu-exit-description" : undefined}
    >
      <WorldBackground paused={paused} />

      <div className="menu-entry-wipe" aria-hidden="true">
        <i /><i /><i /><i /><i /><i />
      </div>

      <div className={`main-menu-shell ${panel === "main" ? "main-menu-shell-home" : "main-menu-shell-panel"}`}>
        {panel === "main" ? (
          <GlassPanel className="main-menu-content">
            <header className="main-menu-brand">
              <p>Interactive developer portfolio</p>
              <RevealText as="h1" id="main-menu-title" text={profile.shortName} mode="entrance" delay={120} />
              <span>Build real systems. Explore the work.</span>
            </header>

            <div className="main-menu-buttons" aria-label="Portfolio main menu">
              <GameMenuButton
                icon="diamond"
                variant="primary"
                selected={selectedAction === "start"}
                onFocus={() => setSelectedAction("start")}
                onPointerEnter={() => setSelectedAction("start")}
                onClick={() => enterPortfolio(false)}
              >
                Start portfolio
              </GameMenuButton>
              <GameMenuButton
                icon="crafting-table"
                selected={selectedAction === "options"}
                onFocus={() => setSelectedAction("options")}
                onPointerEnter={() => setSelectedAction("options")}
                onClick={() => openPanel("options")}
              >
                Options
              </GameMenuButton>
              <GameMenuButton
                icon="nether-star"
                selected={selectedAction === "achievements"}
                onFocus={() => setSelectedAction("achievements")}
                onPointerEnter={() => setSelectedAction("achievements")}
                onClick={() => openPanel("achievements")}
              >
                Achievements
              </GameMenuButton>
              <GameMenuButton
                icon="book"
                selected={selectedAction === "about"}
                onFocus={() => setSelectedAction("about")}
                onPointerEnter={() => setSelectedAction("about")}
                onClick={() => openPanel("about")}
              >
                About
              </GameMenuButton>
              <GameMenuButton
                icon={hasEntered ? "arrow" : "oak-door"}
                variant="danger"
                selected={selectedAction === "exit"}
                onFocus={() => setSelectedAction("exit")}
                onPointerEnter={() => setSelectedAction("exit")}
                onClick={() => hasEntered ? enterPortfolio(true) : openPanel("exit")}
              >
                {hasEntered ? "Back" : "Exit menu"}
              </GameMenuButton>
            </div>

            <footer className="main-menu-footer">
              <span>WORLD / PORTFOLIO</span>
              <span><kbd>↑</kbd><kbd>↓</kbd> Select&nbsp;&nbsp; <kbd>Enter</kbd> Confirm&nbsp;&nbsp; <kbd>Esc</kbd> Back</span>
              <span>v2.0 · ONLINE</span>
            </footer>
          </GlassPanel>
        ) : null}

        {panel === "options" ? (
          <OptionsPanel preferences={preferences} onBack={backToMain} onChange={updatePreferences} onReset={resetPreferences} />
        ) : null}
        {panel === "achievements" ? <AchievementsPanel onBack={backToMain} /> : null}
        {panel === "about" ? <AboutPanel onBack={backToMain} onEnter={() => enterPortfolio(false)} /> : null}
        {panel === "exit" ? <ExitPrompt onBack={backToMain} onStart={() => enterPortfolio(false)} /> : null}
      </div>
    </section>
  );
}
