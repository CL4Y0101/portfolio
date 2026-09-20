import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { RevealVariant } from "@/components/motion/motion";

type RevealElement = "article" | "div" | "header" | "li" | "section";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: RevealElement;
  children: ReactNode;
  delay?: number;
  variant?: RevealVariant;
};

export function Reveal({
  as: Component = "div",
  children,
  delay = 0,
  style,
  variant = "fade-up",
  ...props
}: RevealProps) {
  const revealStyle = {
    ...style,
    "--reveal-delay": `${Math.max(0, delay)}ms`,
  } as CSSProperties;

  return (
    <Component data-scroll-reveal={variant} style={revealStyle} {...props}>
      {children}
    </Component>
  );
}
