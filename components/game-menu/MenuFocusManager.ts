"use client";

import { useEffect, type RefObject } from "react";

const focusableSelector = "[data-game-focusable]:not([disabled])";

export function useMenuFocusManager(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  focusKey: string,
  onEscape: () => void,
) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const focusables = () => Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
    const focusFrame = window.requestAnimationFrame(() => focusables()[0]?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      const items = focusables();
      if (!items.length) return;
      const currentIndex = Math.max(0, items.indexOf(document.activeElement as HTMLElement));
      let nextIndex: number | null = null;

      if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (currentIndex + 1) % items.length;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + items.length) % items.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = items.length - 1;

      if (event.key === "Escape") {
        event.preventDefault();
        onEscape();
        return;
      }

      if (event.key === "Enter") {
        const activeItem = document.activeElement instanceof HTMLElement
          ? document.activeElement.closest<HTMLElement>(focusableSelector)
          : null;
        if (activeItem) {
          event.preventDefault();
          activeItem.click();
        }
        return;
      }

      if (event.key === "Tab") {
        const direction = event.shiftKey ? -1 : 1;
        const targetIndex = (currentIndex + direction + items.length) % items.length;
        event.preventDefault();
        items[targetIndex]?.focus();
        return;
      }

      if (nextIndex !== null) {
        event.preventDefault();
        items[nextIndex]?.focus();
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, containerRef, focusKey, onEscape]);
}
