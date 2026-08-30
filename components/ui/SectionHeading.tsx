import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  titleId?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  titleId,
}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${align === "center" ? "section-heading-centered" : ""}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={titleId}>{title}</h2>
        {description ? <p className="section-description">{description}</p> : null}
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </div>
  );
}
