/**
 * Adapted from liquid-glass.js, Copyright (c) 2026 Deepika Rao (MIT).
 * License: public/vendor/liquid-glass/LICENSE.
 * SSR-safe, bounded maps, one displacement pass, per-instance SVG cleanup.
 */
const svgNamespace = "http://www.w3.org/2000/svg";
let nextFilterId = 0;

export function createLiquidGlass(element: HTMLElement) {
  // Keep the upstream frosted fallback where SVG backdrops are not supported.
  const ua = navigator.userAgent;
  if (!/Chrome|Chromium|Edg/.test(ua) || /Firefox/.test(ua) ||
      !CSS.supports("backdrop-filter", "url(#mc-glass)") || !("ResizeObserver" in window)) {
    return () => {};
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return () => {};

  const id = `portfolio-glass-${++nextFilterId}`;
  const svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true");
  svg.style.position = "absolute";
  svg.style.pointerEvents = "none";
  const defs = document.createElementNS(svgNamespace, "defs");
  const filter = document.createElementNS(svgNamespace, "filter");
  filter.id = id;
  filter.setAttribute("x", "0");
  filter.setAttribute("y", "0");
  filter.setAttribute("width", "100%");
  filter.setAttribute("height", "100%");
  filter.setAttribute("color-interpolation-filters", "sRGB");
  const map = document.createElementNS(svgNamespace, "feImage");
  map.setAttribute("result", "map");
  map.setAttribute("preserveAspectRatio", "none");
  const displacement = document.createElementNS(svgNamespace, "feDisplacementMap");
  displacement.setAttribute("in", "SourceGraphic");
  displacement.setAttribute("in2", "map");
  displacement.setAttribute("scale", "-20");
  displacement.setAttribute("xChannelSelector", "R");
  displacement.setAttribute("yChannelSelector", "B");
  filter.append(map, displacement);
  defs.append(filter);
  svg.append(defs);
  element.append(svg);

  let lastSize = "";
  let timer: ReturnType<typeof setTimeout> | undefined;
  const clearEffect = () => {
    element.style.removeProperty("--portfolio-glass-filter");
    delete element.dataset.glass;
  };

  const refresh = () => {
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    if (!width || !height || width > 800 || height > 800) {
      clearEffect();
      lastSize = "";
      return;
    }
    const size = `${width}:${height}`;
    if (lastSize === size) return;
    lastSize = size;

    // A map is generated on mount/resize only, never in an animation loop.
    const ratio = Math.min(1, 384 / Math.max(width, height));
    const w = Math.max(1, Math.round(width * ratio));
    const h = Math.max(1, Math.round(height * ratio));
    canvas.width = w;
    canvas.height = h;
    const gx = context.createLinearGradient(0, 0, w, 0);
    gx.addColorStop(0, "rgb(0,0,0)");
    gx.addColorStop(1, "rgb(255,0,0)");
    context.fillStyle = gx;
    context.fillRect(0, 0, w, h);
    const gy = context.createLinearGradient(0, 0, 0, h);
    gy.addColorStop(0, "rgb(0,0,0)");
    gy.addColorStop(1, "rgb(0,0,255)");
    context.globalCompositeOperation = "difference";
    context.fillStyle = gy;
    context.fillRect(0, 0, w, h);
    context.globalCompositeOperation = "source-over";
    context.filter = `blur(${8 * ratio}px)`;
    context.fillStyle = "rgb(128,128,128)";
    const inset = 0.05 * Math.min(w, h);
    context.fillRect(inset, inset, w - 2 * inset, h - 2 * inset);
    context.filter = "none";
    try {
      map.setAttribute("href", canvas.toDataURL());
      map.setAttribute("width", String(width));
      map.setAttribute("height", String(height));
      element.style.setProperty("--portfolio-glass-filter", `url(#${id}) blur(5px) saturate(1.15)`);
      element.dataset.glass = "refracted";
    } catch {
      // Privacy settings can restrict canvas export; the CSS fallback stays usable.
      clearEffect();
    }
  };

  refresh();
  const observer = new ResizeObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(refresh, 120);
  });
  observer.observe(element);
  return () => {
    observer.disconnect();
    clearTimeout(timer);
    clearEffect();
    svg.remove();
  };
}
