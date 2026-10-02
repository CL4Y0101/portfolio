import { profile } from "@/data/profile";

export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionCalendar = {
  year: number;
  asOf: string;
  days: ContributionDay[];
};

const githubUser = new URL(profile.github).pathname.split("/").filter(Boolean)[0];

export async function getGitHubContributions(): Promise<ContributionCalendar | null> {
  const asOf = new Date().toISOString().slice(0, 10);
  const year = Number(asOf.slice(0, 4));
  const url = `https://github.com/users/${githubUser}/contributions?from=${year}-01-01&to=${year}-12-31`;

  try {
    const response = await fetch(url, {
      cache: "force-cache",
      headers: { "User-Agent": "Aditya-Fadni-Portfolio" },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

    const html = await response.text();
    const days: ContributionDay[] = [];
    const cells = html.matchAll(/<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*\bdata-level="([0-4])"[^>]*>\s*<\/td>\s*<tool-tip\b[^>]*>([^<]*)<\/tool-tip>/g);

    for (const [, date, level, tooltip] of cells) {
      if (!date.startsWith(`${year}-`)) continue;
      const countText = tooltip.match(/([\d,]+) contributions? on/);
      const count = countText ? Number(countText[1].replaceAll(",", "")) : /^No contributions on/.test(tooltip) ? 0 : NaN;
      if (!Number.isSafeInteger(count) || count < 0) throw new Error(`Invalid contribution count for ${date}`);
      days.push({ date, count, level: Number(level) as ContributionDay["level"] });
    }

    const expectedDays = (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / 86400000;
    if (days.length !== expectedDays || new Set(days.map((day) => day.date)).size !== expectedDays) {
      throw new Error(`Incomplete GitHub contribution calendar for ${year}`);
    }

    return { year, asOf, days: days.filter((day) => day.date <= asOf) };
  } catch (error) {
    console.warn("GitHub contribution calendar is unavailable during this build.", error);
    return null;
  }
}
