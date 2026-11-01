"use client";

/**
 * MinecraftRidges: a living voxel horizon behind the whole page, adapted from
 * the ink-ridges concept (21st.dev) and reskinned to this site's Minecraft
 * theme. Layered blocky ridges (far stone mountains with snow caps, near grass
 * and dirt hills) build in column by column like loading chunks, under a
 * square sun and drifting block clouds; mist bands sit between the ridges and
 * a small pixel flock crosses now and then. Scrolling parallaxes the layers:
 * far ridges lag, the sun sinks fastest. Canvas 2D, redrawn in coarse steps,
 * only while the tab is visible. Reduced motion gets one static frame.
 * The palette follows the site theme (dataset.theme): dusk for dark, day for
 * light.
 */

import * as React from "react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import styles from "./minecraft-ridges.module.css";

const BLK = 14;

function hashi(x: number, s: number): number {
  let n = (Math.imul(x, 374761393) + Math.imul(s, 668265263)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

function vnoise(x: number, s: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return hashi(i, s) * (1 - u) + hashi(i + 1, s) * u;
}

function fbm(x: number, s: number): number {
  return vnoise(x, s) * 0.6 + vnoise(x * 2.1, s + 9) * 0.28 + vnoise(x * 4.3, s + 21) * 0.12;
}

type LayerDef = {
  seed: number;
  base: number;
  amp: number;
  freq: number;
  par: number;
};

const LAYERS: LayerDef[] = [
  { seed: 7, base: 0.62, amp: 0.3, freq: 0.055, par: 0.1 },
  { seed: 23, base: 0.48, amp: 0.24, freq: 0.075, par: 0.22 },
  { seed: 41, base: 0.34, amp: 0.18, freq: 0.1, par: 0.38 },
  { seed: 59, base: 0.2, amp: 0.12, freq: 0.13, par: 0.55 },
];

type Palette = {
  skyTop: string;
  skyMid: string;
  skyLow: string;
  sunCore: string;
  sunGlow: string;
  cloud: string;
  mist: string;
  bird: string;
  layers: Array<{ top: string; body: string; cap?: string }>;
  stars: boolean;
};

const PALETTES: Record<"dark" | "light", Palette> = {
  dark: {
    skyTop: "#151416",
    skyMid: "#2b3a67",
    skyLow: "#c97a4a",
    sunCore: "#ffd75e",
    sunGlow: "#ffb74d",
    cloud: "rgba(255,255,255,0.5)",
    mist: "rgba(240,244,255,0.09)",
    bird: "#0d0b09",
    stars: true,
    layers: [
      { top: "#7e8ba3", body: "#55648a", cap: "#dfe7f5" },
      { top: "#578c46", body: "#43301f" },
      { top: "#4a7d3a", body: "#332619" },
      { top: "#3f702f", body: "#271c11" },
    ],
  },
  light: {
    skyTop: "#f7f8f6",
    skyMid: "#bcd6f5",
    skyLow: "#eaf3fd",
    sunCore: "#ffd75e",
    sunGlow: "#f5b93f",
    cloud: "rgba(255,255,255,0.92)",
    mist: "rgba(255,255,255,0.4)",
    bird: "#2c2115",
    stars: false,
    layers: [
      { top: "#aebdd2", body: "#8fa1bb", cap: "#ffffff" },
      { top: "#79b657", body: "#9c7a52" },
      { top: "#67a84b", body: "#8a6a44" },
      { top: "#579c3f", body: "#77572f" },
    ],
  },
};

export function MinecraftRidges() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");

  React.useEffect(() => {
    const read = () =>
      setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  React.useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const pal = PALETTES[theme];

    let W = 0;
    let H = 0;
    let cols = 0;
    let raf = 0;
    let last = 0;
    let lastFlock = -20;
    let birds: { start: number; dur: number } | null = null;
    const t0 = performance.now();
    const clouds = [0, 1, 2, 3, 4].map((i) => ({
      x: hashi(i, 3) * 1.4 - 0.2,
      y: 0.05 + hashi(i, 5) * 0.2,
      w: 5 + Math.floor(hashi(i, 8) * 6),
      s: 0.008 + hashi(i, 11) * 0.01,
    }));

    const resize = () => {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
      cols = Math.ceil(W / BLK);
    };
    resize();
    window.addEventListener("resize", resize);

    const layerHeightAt = (L: LayerDef, c: number, band: number) => {
      const h = L.base + (fbm(c * L.freq, L.seed) - 0.5) * 2 * L.amp;
      return Math.max(BLK * 2, Math.round((h * band) / BLK) * BLK);
    };

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      const scrollY = window.scrollY || 0;
      const band = H * 0.52;
      ctx.clearRect(0, 0, W, H);

      // sky wash: theme background at the top, colour only near the horizon
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, pal.skyTop);
      grad.addColorStop(0.52, pal.skyTop);
      grad.addColorStop(0.78, pal.skyMid);
      grad.addColorStop(1, pal.skyLow);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      if (pal.stars) {
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        for (let i = 0; i < 60; i++) {
          const sx = hashi(i, 101) * W;
          const sy = hashi(i, 202) * H * 0.4;
          if (hashi(i + Math.floor(t * 2), 303) > 0.4) ctx.fillRect(sx, sy, 2, 2);
        }
      }

      // square sun just above the far ridge, sinking fastest on scroll
      const sunS = BLK * 4;
      const sunX = Math.floor(W * 0.5 - (BLK * 4) / 2);
      const sunY = Math.floor(H - band * 0.94 - BLK * 4 + scrollY * 0.12);
      ctx.fillStyle = pal.sunGlow;
      ctx.globalAlpha = 0.22;
      ctx.fillRect(sunX - BLK, sunY - BLK, sunS + BLK * 2, sunS + BLK * 2);
      ctx.globalAlpha = 1;
      ctx.fillStyle = pal.sunGlow;
      ctx.fillRect(sunX, sunY, sunS, sunS);
      ctx.fillStyle = pal.sunCore;
      ctx.fillRect(sunX + BLK * 0.7, sunY + BLK * 0.7, sunS - BLK * 1.4, sunS - BLK * 1.4);

      // block clouds drift in steps
      ctx.fillStyle = pal.cloud;
      for (const cl of clouds) {
        const cx = (((cl.x + t * cl.s) % 1.3) - 0.15) * W;
        const stepX = Math.floor(cx / BLK) * BLK;
        const cy = Math.floor((cl.y * H) / BLK) * BLK;
        ctx.fillRect(stepX, cy, cl.w * BLK, BLK);
        ctx.fillRect(stepX + BLK, cy + BLK, (cl.w - 2) * BLK, BLK);
      }

      // terrain layers far to near, each building in with its own stagger
      LAYERS.forEach((L, li) => {
        const colors = pal.layers[li];
        const p = reduced ? 1 : Math.min(1, Math.max(0, (t - li * 0.22) / 1.5));
        const eased = p * p * (3 - 2 * p);
        const reveal = Math.floor(eased * (cols + 30));
        const sunk = Math.floor(scrollY * L.par * 0.4);
        for (let c = 0; c < cols; c++) {
          if (c > reveal) break;
          const hPx = layerHeightAt(L, c + 20, band);
          const topY = H - hPx + sunk;
          if (topY > H) continue;
          ctx.fillStyle = colors.body;
          ctx.fillRect(c * BLK, topY, BLK, H - topY);
          ctx.fillStyle = colors.top;
          ctx.fillRect(c * BLK, topY, BLK, BLK);
          if (colors.cap && fbm(c * 0.3, L.seed + 4) > 0.55) {
            ctx.fillStyle = colors.cap;
            ctx.fillRect(c * BLK, topY, BLK, BLK);
          }
          ctx.fillStyle = "rgba(0,0,0,0.12)";
          for (let y = topY + BLK; y < H; y += BLK) {
            if (hashi(c * 31 + y, L.seed) > 0.72) ctx.fillRect(c * BLK, y, BLK, BLK);
          }
        }
        // mist band hovering over this ridge
        ctx.fillStyle = pal.mist;
        const mistY = H - L.base * band - L.amp * band * 0.4 + sunk;
        ctx.fillRect(0, mistY, W, BLK * 1.4);
      });

      // an occasional small pixel flock crosses along the mid ridge
      if (!reduced && t - lastFlock > 16) {
        birds = { start: t, dur: 11 };
        lastFlock = t;
      }
      if (birds) {
        const u = (t - birds.start) / birds.dur;
        if (u > 1) birds = null;
        else {
          ctx.fillStyle = pal.bird;
          for (let k = 0; k < 5; k++) {
            const rank = Math.ceil(k / 2);
            const side = k === 0 ? 0 : k % 2 ? 1 : -1;
            const bx = (u * 1.25 - 0.12) * W - rank * BLK * 2.2;
            const by = H * 0.4 + side * rank * BLK * 1.1 + Math.sin(t * 2 + k) * 3;
            const flap = Math.sin(t * 9 + k * 1.4) > 0 ? 0 : 1;
            ctx.fillRect(bx, by, BLK * 0.8, 3);
            ctx.fillRect(bx - BLK * 0.7, by + (flap ? -4 : 3), BLK * 0.7, 3);
            ctx.fillRect(bx + BLK * 0.8, by + (flap ? -4 : 3), BLK * 0.7, 3);
          }
        }
      }
    };

    if (reduced) {
      draw(t0 + 4000);
      const onScroll = () => draw(performance.now());
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    const loop = (now: number) => {
      if (now - last > 90 && !document.hidden) {
        draw(now);
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [theme, reduced]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
