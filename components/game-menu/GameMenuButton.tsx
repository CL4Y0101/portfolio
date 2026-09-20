import type { ButtonHTMLAttributes } from "react";
import { GameIcon, type GameIconName } from "@/components/game-ui/GameIcon";
import ui from "@/components/game-ui/minecraft.module.css";

type GameMenuButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: GameIconName;
  selected?: boolean;
  variant?: "primary" | "secondary" | "danger";
};

export function GameMenuButton({
  children,
  className = "",
  icon,
  selected = false,
  variant = "secondary",
  ...props
}: GameMenuButtonProps) {
  return (
    <button
      {...props}
      className={`game-menu-button game-menu-button-${variant} ${ui.button} ${className}`.trim()}
      data-variant={variant}
      data-game-focusable
      data-selected={selected ? "true" : "false"}
      type="button"
    >
      <span className="game-menu-cursor" aria-hidden="true" />
      {icon ? <GameIcon name={icon} /> : <span aria-hidden="true" />}
      <span>{children}</span>
      <span className="game-menu-key" aria-hidden="true">↵</span>
    </button>
  );
}
