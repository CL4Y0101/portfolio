"use client";

import { Trophy, Volume2, VolumeX, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { introCompleteEvent } from "@/components/game-menu/MainMenuScreen";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { bestUiUxAchievement } from "@/data/achievements";
import { playAchievementSound } from "@/lib/achievement-sound";
import { applyGamePreferences, preferencesChangeEvent, readGamePreferences } from "@/lib/preferences";

const TOAST_SEEN_KEY = "portfolio-achievement-toast-seen";
const DISPLAY_MS = 6500;
const EXIT_MS = 220;

function subscribeSoundPreference(onChange: () => void): () => void {
  window.addEventListener(preferencesChangeEvent, onChange);
  return () => window.removeEventListener(preferencesChangeEvent, onChange);
}

function getSoundSnapshot(): boolean {
  return readGamePreferences().sound;
}

function getSoundServerSnapshot(): boolean {
  return false;
}

function readToastSeen(): boolean {
  try {
    return window.localStorage.getItem(TOAST_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markToastSeen() {
  try {
    window.localStorage.setItem(TOAST_SEEN_KEY, "1");
  } catch {
    // The toast still dismisses for this visit when storage is unavailable.
  }
}

/**
 * Game advancement-style popup that unlocks once per visitor, right after the
 * first world-entry intro completes. Visual only by default; the chime plays
 * only when the visitor enabled "Sound cues" in Options.
 */
export function AchievementToast() {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  /* Sound preference is read post-hydration so SSR stays consistent. */
  const soundOn = useSyncExternalStore(subscribeSoundPreference, getSoundSnapshot, getSoundServerSnapshot);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    dismissTimerRef.current = null;
    exitTimerRef.current = null;
  }, []);

  const dismiss = useCallback(() => {
    clearTimers();
    markToastSeen();
    setShown(false);
    exitTimerRef.current = setTimeout(() => setMounted(false), EXIT_MS);
  }, [clearTimers]);

  useEffect(() => {
    const onIntroComplete = () => {
      if (readToastSeen()) return;
      setMounted(true);
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => setShown(true)));
      if (readGamePreferences().sound) void playAchievementSound();
      dismissTimerRef.current = setTimeout(() => dismiss(), DISPLAY_MS);
    };
    window.addEventListener(introCompleteEvent, onIntroComplete);
    return () => {
      window.removeEventListener(introCompleteEvent, onIntroComplete);
      clearTimers();
    };
  }, [clearTimers, dismiss]);

  useEffect(() => {
    if (!mounted) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mounted, dismiss]);

  const toggleSound = useCallback(() => {
    const next = !readGamePreferences().sound;
    applyGamePreferences({ ...readGamePreferences(), sound: next });
    if (next) void playAchievementSound();
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="achievement-toast"
      role="status"
      data-shown={shown ? "true" : "false"}
    >
      <span className="achievement-toast-icon" aria-hidden="true">
        <Trophy size={20} />
      </span>
      <div className="achievement-toast-copy">
        <p className="achievement-toast-kicker">
          <LocalizedText en="Achievement unlocked" />
        </p>
        <p className="achievement-toast-title">
          <LocalizedText en={bestUiUxAchievement.title} />
        </p>
        <p className="achievement-toast-sub">
          <LocalizedText en={bestUiUxAchievement.issuer} />
        </p>
      </div>
      <div className="achievement-toast-actions">
        <button
          type="button"
          className="achievement-toast-button"
          aria-pressed={soundOn}
          onClick={toggleSound}
        >
          <span className="sr-only">
            <LocalizedText en={soundOn ? "Mute achievement sound" : "Unmute achievement sound"} />
          </span>
          {soundOn ? <Volume2 aria-hidden="true" size={15} /> : <VolumeX aria-hidden="true" size={15} />}
        </button>
        <button
          type="button"
          className="achievement-toast-button"
          onClick={dismiss}
        >
          <span className="sr-only"><LocalizedText en="Dismiss" /></span>
          <X aria-hidden="true" size={15} />
        </button>
      </div>
    </div>
  );
}
