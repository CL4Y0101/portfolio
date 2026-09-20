export type GameIconName =
  | "diamond"
  | "crafting-table"
  | "nether-star"
  | "book"
  | "arrow"
  | "oak-door"
  | "compass"
  | "emerald"
  | "redstone"
  | "chest";

const sizes = { sm: 16, md: 24, xl: 32, "2xl": 40 } as const;

/** Empty alt marks icons beside a visible label as decorative. */
export function GameIcon({
  name,
  alt = "",
  size = "md",
  className = "",
}: {
  name: GameIconName;
  alt?: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      className={`mc-ui-icon mc-ui-${name} ${className}`.trim()}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      style={{ width: sizes[size], height: sizes[size] }}
    />
  );
}
