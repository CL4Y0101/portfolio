"use client";

import { useMemo } from "react";
import { useLanguage } from "@/components/ui/useLanguage";
import ContributionSkyline, { type ContributionDay } from "@/components/ui/ContributionSkyline";

/**
 * ContributionSkyline wired to the portfolio's language toggle.
 * Localizes the heading, unit nouns and number/date formatting;
 * the skyline itself stays theme-aware through CSS variables.
 */
export function ContributionSkylineLocalized({ days, asOf }: { days: ContributionDay[]; asOf?: string }) {
  const language = useLanguage();
  const indonesian = language === "id";

  const total = useMemo(() => days.reduce((sum, day) => sum + day.count, 0), [days]);
  const formatted = useMemo(
    () => new Intl.NumberFormat(indonesian ? "id-ID" : "en-US").format(total),
    [total, indonesian],
  );

  return (
    <ContributionSkyline
      data={days}
      endDate={asOf}
      locale={indonesian ? "id-ID" : "en-US"}
      unit={indonesian ? "kontribusi" : "contribution"}
      unitPlural={indonesian ? "kontribusi" : "contributions"}
      title={
        <>
          <span className="font-semibold tabular-nums">{formatted}</span>{" "}
          {indonesian ? "kontribusi dalam setahun terakhir" : "contributions in the last year"}
        </>
      }
    />
  );
}
