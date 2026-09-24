import { translate } from "@/lib/translations";

/** Both variants are server-rendered; the root language attribute selects one before paint. */
export function LocalizedText({ en, id }: { en: string; id?: string }) {
  const indonesia = id ?? translate(en);
  if (indonesia === en) return <>{en}</>;

  return (
    <span className="localized-text">
      <span className="localized-en" lang="en">{en}</span>
      <span className="localized-id" lang="id">{indonesia}</span>
    </span>
  );
}
