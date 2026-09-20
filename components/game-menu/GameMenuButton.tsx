import type { ButtonHTMLAttributes, ComponentType } from "react";

type GameMenuButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  selected?: boolean;
  variant?: "primary" | "secondary" | "danger";
};

export function GameMenuButton({
  children,
  className = "",
  icon: Icon,
  selected = false,
  variant = "secondary",
  ...props
}: GameMenuButtonProps) {
  return (
    <button
      {...props}
      className={`game-menu-button game-menu-button-${variant} ${className}`.trim()}
      data-game-focusable
      data-selected={selected ? "true" : "false"}
      type="button"
    >
      <span className="game-menu-cursor" aria-hidden="true" />
      {Icon ? <Icon aria-hidden={true} size={19} /> : null}
      <span>{children}</span>
      <span className="game-menu-key" aria-hidden="true">↵</span>
    </button>
  );
}
