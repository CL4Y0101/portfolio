#!/usr/bin/env node
/**
 * Sync the public GitHub contribution calendar into data/contributions.json.
 *
 * Scrapes https://github.com/users/<user>/contributions (no token needed —
 * the per-day counts are embedded in the page's <tool-tip> elements) and
 * stores the trailing year as [{ date: "YYYY-MM-DD", count: n }].
 *
 * Runs automatically before every commit via .githooks/pre-commit
 * (enable once with `npm run setup:hooks`), or manually:
 *
 *   npm run contributions:sync
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const USERNAME = "CL4Y0101";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = join(root, "data", "contributions.json");

const response = await fetch(`https://github.com/users/${USERNAME}/contributions`, {
  headers: { "User-Agent": "Aditya-Fadni-Portfolio/contributions-sync" },
  signal: AbortSignal.timeout(15000),
});
if (!response.ok) throw new Error(`GitHub responded with ${response.status}`);

const html = await response.text();
const days = [];
const cells = html.matchAll(
  /<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*>\s*<\/td>\s*<tool-tip\b[^>]*>([^<]*)<\/tool-tip>/g,
);
for (const [, date, tooltip] of cells) {
  const match = tooltip.match(/([\d,]+) contributions? on/);
  const count = match ? Number(match[1].replaceAll(",", "")) : 0;
  if (!Number.isSafeInteger(count) || count < 0) throw new Error(`Invalid contribution count for ${date}`);
  days.push({ date, count });
}
days.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

if (days.length < 300 || new Set(days.map((day) => day.date)).size !== days.length) {
  throw new Error(`Parsed only ${days.length} days — the GitHub page format may have changed`);
}

const asOf = days[days.length - 1].date;
await mkdir(dirname(outFile), { recursive: true });
await writeFile(outFile, `${JSON.stringify({ asOf, days }, null, 2)}\n`);

const total = days.reduce((sum, day) => sum + day.count, 0);
console.log(
  `contributions: synced ${days.length} days through ${asOf} (${total.toLocaleString("en-US")} total) -> data/contributions.json`,
);
