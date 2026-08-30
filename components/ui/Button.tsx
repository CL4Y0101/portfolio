import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet";
  external?: boolean;
  download?: boolean;
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  download = false,
  className = "",
}: ButtonProps) {
  const classes = `button button-${variant} ${className}`.trim();

  if (external || download) {
    return (
      <a
        className={classes}
        href={href}
        download={download || undefined}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {children}
    </Link>
  );
}
