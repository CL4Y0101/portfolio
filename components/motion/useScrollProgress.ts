"use client";

import { useEffect, useRef, type RefObject } from "react";
import { subscribeScrollProgress, type ScrollFrame } from "./scroll-progress";

type Options = {
  mode?: "sticky" | "leave";
  closest?: string;
  stageSelector?: string;
  onProgress?: (frame: ScrollFrame) => void;
};

/** Progress stays in a ref: continuous scroll does not re-render the React tree. */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, options: Options = {}) {
  const progress = useRef<ScrollFrame>({ progress: 0, enabled: false, width: 0, start: 0, travel: 1 });
  const callback = useRef(options.onProgress);
  useEffect(() => { callback.current = options.onProgress; });
  const { mode = "sticky", closest, stageSelector } = options;
  useEffect(() => {
    const element = closest ? ref.current?.closest<HTMLElement>(closest) : ref.current;
    if (!element) return;
    const stage = stageSelector ? element.querySelector<HTMLElement>(stageSelector) ?? undefined : undefined;
    return subscribeScrollProgress({ element, stage, mode, update: (value) => {
      progress.current = value;
      callback.current?.(value);
    } });
  }, [ref, mode, closest, stageSelector]);
  return progress;
}
