import { Fragment, type CSSProperties, type ElementType } from "react";
import { translate } from "@/lib/translations";

type RevealTextProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  text: string;
  className?: string;
  id?: string;
  mode?: "entrance" | "scroll";
  /** Milliseconds, matching the portfolio motion tokens. */
  delay?: number;
  duration?: number;
  stagger?: number;
  yOffset?: number;
  blur?: number;
};

type WordStyle = CSSProperties & {
  "--word-delay": string;
  "--word-delay-compact": string;
  "--word-duration": string;
  "--word-offset": string;
  "--word-blur": string;
};

export function RevealText({
  as = "h2",
  text,
  className,
  id,
  mode = "scroll",
  delay = 0,
  duration = 520,
  stagger = 55,
  yOffset = 20,
  blur = 6,
}: RevealTextProps) {
  const Component: ElementType = as;
  const indonesia = translate(text);

  const renderWords = (copy: string) => copy.trim().split(/\s+/).map((word, index, words) => {
    const wordStyle: WordStyle = {
      "--word-delay": `${Math.max(0, delay + index * stagger)}ms`,
      "--word-delay-compact": `${Math.max(0, delay + index * Math.min(stagger, 30))}ms`,
      "--word-duration": `${Math.max(0, duration)}ms`,
      "--word-offset": `${Math.max(0, yOffset)}px`,
      "--word-blur": `${Math.max(0, blur)}px`,
    };

    return (
      <Fragment key={`${word}-${index}`}>
        <span className="reveal-text-word" style={wordStyle}>{word}</span>
        {index < words.length - 1 ? " " : null}
      </Fragment>
    );
  });

  const renderVariant = (copy: string, locale?: "en" | "id") => (
    <span className={locale ? `localized-${locale}` : undefined} lang={locale}>
      <span className="sr-only">{copy}</span>
      <span className="reveal-text-visual" aria-hidden="true">{renderWords(copy)}</span>
    </span>
  );

  return (
    <Component
      id={id}
      className={`reveal-text ${className ?? ""}`.trim()}
      {...(mode === "scroll" ? { "data-scroll-reveal": "word" } : { "data-word-reveal": "entrance" })}
    >
      {indonesia === text ? renderVariant(text) : <>{renderVariant(text, "en")}{renderVariant(indonesia, "id")}</>}
    </Component>
  );
}
