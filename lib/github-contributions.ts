import raw from "@/data/contributions.json";

export type ContributionDay = {
  date: string;
  count: number;
};

type ContributionsFile = {
  asOf: string;
  days: ContributionDay[];
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValid(value: unknown): value is ContributionsFile {
  if (typeof value !== "object" || value === null) return false;
  const file = value as Record<string, unknown>;
  if (typeof file.asOf !== "string" || !DATE_RE.test(file.asOf)) return false;
  if (!Array.isArray(file.days) || file.days.length === 0) return false;
  const seen = new Set<string>();
  let prev = "";
  for (const day of file.days) {
    if (typeof day !== "object" || day === null) return false;
    const { date, count } = day as Record<string, unknown>;
    if (typeof date !== "string" || !DATE_RE.test(date)) return false;
    if (!Number.isSafeInteger(count) || (count as number) < 0) return false;
    if (seen.has(date) || date < prev) return false;
    seen.add(date);
    prev = date;
  }
  return true;
}

const file: ContributionsFile | null = isValid(raw) ? raw : null;

if (!file) {
  console.warn("data/contributions.json is missing or invalid — run `npm run contributions:sync`.");
}

/** Days synced by scripts/sync-contributions.mjs (trailing year, ascending). */
export function getContributionDays(): ContributionDay[] {
  return file?.days ?? [];
}

/** Last day covered by the synced data, or null when unavailable. */
export function getContributionsAsOf(): string | null {
  return file?.asOf ?? null;
}
