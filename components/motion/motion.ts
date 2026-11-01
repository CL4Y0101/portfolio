export const motionDurations = {
  instant: 80,
  fast: 140,
  base: 220,
  reveal: 520,
  page: 680,
  world: 1050,
  /** World-generation loading screen (Minecraft-style); always paired with a skip control. Compact screens use 1200ms. */
  introCinematic: 1900,
} as const;

export const motionStagger = {
  step: 55,
  maximumItems: 6,
} as const;

export type RevealVariant = "fade-up" | "block-wipe" | "scale-in" | "portal" | "stagger";
