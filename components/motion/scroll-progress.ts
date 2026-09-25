/** One event-driven scheduler for narrative scenes. All geometry reads precede writes. */
export type ScrollFrame = {
  progress: number;
  enabled: boolean;
  width: number;
  start: number;
  travel: number;
};

type Scene = {
  element: HTMLElement;
  stage?: HTMLElement;
  mode: "sticky" | "leave";
  active: boolean;
  update: (frame: ScrollFrame) => void;
};

const scenes = new Set<Scene>();
let observer: IntersectionObserver | undefined;
let frame = 0;
let force = false;

export function worldMotionEnabled() {
  return document.documentElement.dataset.motion === "full" &&
    document.documentElement.dataset.graphics !== "low" &&
    window.matchMedia("(min-width: 1001px) and (min-height: 801px) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function flush() {
  frame = 0;
  const enabled = worldMotionEnabled();
  const scrollY = window.scrollY;
  const pending = [...scenes].filter((scene) => force || scene.active).map((scene) => {
    const rect = scene.element.getBoundingClientRect();
    const top = scene.stage ? parseFloat(getComputedStyle(scene.stage).top) || 0 : 0;
    const travel = Math.max(1, scene.mode === "leave" ? rect.height : rect.height - (scene.stage?.offsetHeight ?? window.innerHeight));
    const start = scrollY + rect.top - top;
    return { scene, value: { progress: clamp((scrollY - start) / travel), enabled, width: rect.width, start, travel } };
  });
  force = false;
  pending.forEach(({ scene, value }) => scene.update(value));
}

function queue() {
  if (!document.hidden && !frame) frame = requestAnimationFrame(flush);
}

function refresh() { force = true; queue(); }

export function subscribeScrollProgress(scene: Omit<Scene, "active">) {
  const subscription: Scene = { ...scene, active: false };
  scenes.add(subscription);
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        for (const item of scenes) if (item.element === entry.target) item.active = entry.isIntersecting;
      }
      queue();
    }, { rootMargin: "180px 0px" });
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", refresh);
    window.addEventListener("portfolio-motion-change", refresh);
    document.addEventListener("visibilitychange", refresh);
  }
  observer.observe(scene.element);
  refresh();
  return () => {
    observer?.unobserve(scene.element);
    scenes.delete(subscription);
    if (scenes.size) return;
    observer?.disconnect();
    observer = undefined;
    cancelAnimationFrame(frame);
    frame = 0;
    window.removeEventListener("scroll", queue);
    window.removeEventListener("resize", refresh);
    window.removeEventListener("portfolio-motion-change", refresh);
    document.removeEventListener("visibilitychange", refresh);
  };
}
