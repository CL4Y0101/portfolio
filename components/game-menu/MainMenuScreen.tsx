"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
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
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { LocalizedText } from "@/components/ui/LocalizedText";
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

/** Dispatched on window when the first world-entry intro finishes (or is skipped). */
export const introCompleteEvent = "portfolio-intro-complete";

/** Staged status lines for the first-visit world-generation cinematic. */
const ENTER_STAGES = [
  { en: "Generating world…", id: "Menyiapkan dunia…" },
  { en: "Loading chunks…", id: "Memuat chunk…" },
  { en: "Spawning player…", id: "Memunculkan pemain…" },
] as const;

const MENU_SEEN_KEY = "portfolio-menu-seen";

function getMenuSeenSnapshot(): string {
  try {
    return window.localStorage.getItem(MENU_SEEN_KEY) ?? "0";
  } catch {
    return "0";
  }
}

function getMenuSeenServerSnapshot(): string {
  return "0";
}

function subscribeMenuSeen(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function MainMenuScreen() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const pendingFocusRef = useRef<"hero" | "previous" | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const [enterDuration, setEnterDuration] = useState(0);
  const [visible, setVisible] = useState(pathname === "/");
  const [hasEntered, setHasEntered] = useState(false);
  const [panel, setPanel] = useState<MenuPanel>("main");
  const [menuState, setMenuState] = useState<MenuState>("active");
  const [enterStage, setEnterStage] = useState(0);
  const [selectedAction, setSelectedAction] = useState<MenuAction>("start");
  const [preferences, setPreferences] = useState<GamePreferences>(defaultGamePreferences);
  const [paused, setPaused] = useState(false);
  const onHomepage = pathname === "/";
  /* Menu intro hanya sekali per visitor; dibaca pasca-hydration agar SSR tetap konsisten. */
  const menuSeen = useSyncExternalStore(subscribeMenuSeen, getMenuSeenSnapshot, getMenuSeenServerSnapshot);
  /* Jangan skip saat transisi entering: menu harus tetap mounted selama sinematik. */
  const skipIntro = menuSeen === "1" && !hasEntered && menuState !== "entering";
  const active = onHomepage && visible && !skipIntro;

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

  const finishEnter = useCallback((wasFirstEntry: boolean, restorePreviousFocus: boolean) => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    pendingFocusRef.current = restorePreviousFocus || !wasFirstEntry ? "previous" : "hero";
    setHasEntered(true);
    setVisible(false);
    setMenuState("active");
    setPanel("main");
    setEnterStage(0);
    if (wasFirstEntry) window.dispatchEvent(new CustomEvent(introCompleteEvent));
  }, []);

  const enterPortfolio = useCallback((restorePreviousFocus = false) => {
    if (transitionTimerRef.current) return;
    playTick();
    const firstEntry = !hasEntered;
    try { window.localStorage.setItem(MENU_SEEN_KEY, "1"); } catch { /* abaikan */ }
    setMenuState("entering");
    // Sinematik intro main tiap first visit di semua device, kecuali motion dimatikan total.
    // (prefers-reduced-motion tetap menonaktifkan zoom/efek gerak via CSS.)
    const motion = document.documentElement.dataset.motion;
    const duration = motion === "off" ? 0
      : firstEntry ? motionDurations.introCinematic : motionDurations.fast;
    setEnterDuration(duration);
    setEnterStage(0);
    if (firstEntry && duration >= 1000) {
      // The cinematic is skippable; give keyboard users immediate access to Skip.
      window.requestAnimationFrame(() => skipButtonRef.current?.focus({ preventScroll: true }));
    } else {
      containerRef.current?.focus({ preventScroll: true });
    }
    transitionTimerRef.current = setTimeout(() => finishEnter(firstEntry, restorePreviousFocus), duration);
  }, [playTick, hasEntered, finishEnter]);

  const skipEnter = useCallback(() => {
    if (menuState !== "entering") return;
    finishEnter(!hasEntered, false);
  }, [menuState, hasEntered, finishEnter]);

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
    if (menuState === "entering") {
      skipEnter();
      return;
    }
    if (panel !== "main") backToMain();
    else if (hasEntered) enterPortfolio(true);
    else openPanel("exit");
  }, [backToMain, enterPortfolio, hasEntered, openPanel, panel, menuState, skipEnter]);

  /* Advance the staged loading lines across the first-visit cinematic. */
  useEffect(() => {
    if (menuState !== "entering" || hasEntered) return;
    if (enterDuration < 1000) return;
    const interval = window.setInterval(() => {
      setEnterStage((stage) => Math.min(stage + 1, ENTER_STAGES.length - 1));
    }, enterDuration / ENTER_STAGES.length);
    return () => window.clearInterval(interval);
  }, [menuState, hasEntered, enterDuration]);

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
      data-entry={hasEntered ? "return" : "first"}
      tabIndex={-1}
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

      <div className="world-loading" role="status" aria-live="polite">
        {menuState === "entering" && !hasEntered ? <>
          <span><LocalizedText en={ENTER_STAGES[enterStage].en} id={ENTER_STAGES[enterStage].id} /></span>
          <i aria-hidden="true" style={{ animationDuration: `${enterDuration}ms` }} />
          {enterDuration >= 1000 ? (
            <button
              ref={skipButtonRef}
              type="button"
              className="world-skip"
              data-game-focusable
              onClick={skipEnter}
            >
              <LocalizedText en="Skip intro" />
            </button>
          ) : null}
        </> : null}
      </div>

      <div inert={menuState === "entering"} className={`main-menu-shell ${panel === "main" ? "main-menu-shell-home" : "main-menu-shell-panel"}`}>
        {panel === "main" ? (
          <GlassPanel className="main-menu-content">
            <header className="main-menu-brand">
              <div className="main-menu-topline">
                <p><LocalizedText en="Interactive developer portfolio" /></p>
                <LanguageToggle />
              </div>
              <RevealText as="h1" id="main-menu-title" text={profile.shortName} mode="entrance" delay={120} />
              <span><LocalizedText en="Build real systems. Explore the work." /></span>
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
                <LocalizedText en="Start portfolio" />
              </GameMenuButton>
              <GameMenuButton
                icon="crafting-table"
                selected={selectedAction === "options"}
                onFocus={() => setSelectedAction("options")}
                onPointerEnter={() => setSelectedAction("options")}
                onClick={() => openPanel("options")}
              >
                <LocalizedText en="Options" />
              </GameMenuButton>
              <GameMenuButton
                icon="nether-star"
                selected={selectedAction === "achievements"}
                onFocus={() => setSelectedAction("achievements")}
                onPointerEnter={() => setSelectedAction("achievements")}
                onClick={() => openPanel("achievements")}
              >
                <LocalizedText en="Achievements" />
              </GameMenuButton>
              <GameMenuButton
                icon="book"
                selected={selectedAction === "about"}
                onFocus={() => setSelectedAction("about")}
                onPointerEnter={() => setSelectedAction("about")}
                onClick={() => openPanel("about")}
              >
                <LocalizedText en="About" />
              </GameMenuButton>
              <GameMenuButton
                icon={hasEntered ? "arrow" : "oak-door"}
                variant="danger"
                selected={selectedAction === "exit"}
                onFocus={() => setSelectedAction("exit")}
                onPointerEnter={() => setSelectedAction("exit")}
                onClick={() => hasEntered ? enterPortfolio(true) : openPanel("exit")}
              >
                <LocalizedText en={hasEntered ? "Back" : "Exit menu"} />
              </GameMenuButton>
            </div>

            <footer className="main-menu-footer">
              <span>WORLD / PORTFOLIO</span>
              <span><kbd>↑</kbd><kbd>↓</kbd> <LocalizedText en="Select" />&nbsp;&nbsp; <kbd>Enter</kbd> <LocalizedText en="Confirm" />&nbsp;&nbsp; <kbd>Esc</kbd> <LocalizedText en="Back" /></span>
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
