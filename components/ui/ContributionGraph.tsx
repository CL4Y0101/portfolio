"use client";

import { useMemo, useState, type KeyboardEvent, type MouseEvent } from "react";
import { useLanguage } from "@/components/ui/useLanguage";
import type { ContributionCalendar, ContributionDay } from "@/lib/github-contributions";
import styles from "./contribution-graph.module.css";

const dayMs = 86400000;
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekdaysId = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function dateAt(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function calendarDays(year: number, data: ContributionDay[]) {
  const byDate = new Map(data.map((day) => [day.date, day]));
  const first = Date.UTC(year, 0, 1);
  const last = Date.UTC(year, 11, 31);
  const start = first - new Date(first).getUTCDay() * dayMs;
  const weeks = Math.ceil((last - start + dayMs) / (7 * dayMs));
  return Array.from({ length: weeks }, (_, week) =>
    Array.from({ length: 7 }, (_, weekday) => {
      const timestamp = start + (week * 7 + weekday) * dayMs;
      return timestamp >= first && timestamp <= last ? byDate.get(dateAt(timestamp)) ?? null : null;
    }),
  );
}

function formatDate(date: string, language: string) {
  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function ContributionGraph({ calendar }: { calendar: ContributionCalendar }) {
  const language = useLanguage();
  const weeks = useMemo(() => calendarDays(calendar.year, calendar.days), [calendar]);
  const byDate = useMemo(() => new Map(calendar.days.map((day) => [day.date, day])), [calendar]);
  const initialDate = calendar.days.at(-1)?.date ?? `${calendar.year}-01-01`;
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [month, setMonth] = useState(Number(initialDate.slice(5, 7)) - 1);
  const [hover, setHover] = useState<{ date: string; x: number; y: number } | null>(null);
  const selected = byDate.get(selectedDate) ?? null;
  const hovered = hover ? byDate.get(hover.date) : null;

  const firstWeekday = new Date(Date.UTC(calendar.year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(calendar.year, month + 1, 0)).getUTCDate();
  const monthDays = Array.from({ length: firstWeekday + daysInMonth }, (_, index) =>
    index < firstWeekday ? null : byDate.get(dateAt(Date.UTC(calendar.year, month, index - firstWeekday + 1))) ?? null,
  );

  function countLabel(day: ContributionDay) {
    const contribution = language === "id" ? "kontribusi" : day.count === 1 ? "contribution" : "contributions";
    return `${day.count} ${contribution}, ${formatDate(day.date, language)}`;
  }

  function selectDay(date: string) {
    setSelectedDate(date);
    setMonth(Number(date.slice(5, 7)) - 1);
  }

  function handleHover(day: ContributionDay, event: MouseEvent<HTMLButtonElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setHover({
      date: day.date,
      x: Math.min(bounds.left, window.innerWidth - 230),
      y: Math.max(8, bounds.top - 52),
    });
  }

  function handleKey(event: KeyboardEvent<HTMLButtonElement>, day: ContributionDay, view: "year" | "month") {
    const offsets: Record<string, number> = view === "year"
      ? { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 }
      : { ArrowUp: -7, ArrowDown: 7, ArrowLeft: -1, ArrowRight: 1 };
    const offset = offsets[event.key];
    if (offset === undefined) return;
    event.preventDefault();
    const next = byDate.get(dateAt(Date.parse(`${day.date}T00:00:00Z`) + offset * dayMs));
    if (!next || (view === "month" && Number(next.date.slice(5, 7)) - 1 !== month)) return;
    selectDay(next.date);
    event.currentTarget.closest<HTMLElement>("[data-calendar-view]")
      ?.querySelector<HTMLButtonElement>(`[data-contribution-date="${next.date}"]`)?.focus();
  }

  function dayButton(day: ContributionDay, view: "year" | "month") {
    return <button key={day.date} type="button" className={styles.day} data-level={day.level}
      data-contribution-date={day.date} aria-label={countLabel(day)} aria-pressed={selectedDate === day.date}
      tabIndex={selectedDate === day.date ? 0 : -1}
      onClick={() => selectDay(day.date)} onFocus={() => selectDay(day.date)}
      onMouseEnter={(event) => handleHover(day, event)} onMouseLeave={() => setHover(null)}
      onKeyDown={(event) => handleKey(event, day, view)}>
      {view === "month" ? <span className={styles.dayNumber} aria-hidden="true">{Number(day.date.slice(-2))}</span> : null}
    </button>;
  }

  const monthNames = Array.from({ length: 12 }, (_, index) =>
    new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", { month: "short", timeZone: "UTC" })
      .format(new Date(Date.UTC(calendar.year, index, 1))),
  );

  return <div className={styles.graph}>
    <div className={styles.yearView} data-calendar-view="year">
      <div className={styles.scroller} role="region" tabIndex={0}
        aria-label={language === "id" ? `Kalender kontribusi GitHub ${calendar.year}, gulir horizontal untuk bulan lainnya` : `GitHub contribution calendar ${calendar.year}, scroll horizontally for more months`}>
        <div className={styles.fullYear}>
          <div className={styles.monthLabels} style={{ gridTemplateColumns: `repeat(${weeks.length}, var(--day-size))` }}>
            {monthNames.map((name, index) => {
              const first = Date.UTC(calendar.year, index, 1);
              const start = Date.UTC(calendar.year, 0, 1) - new Date(Date.UTC(calendar.year, 0, 1)).getUTCDay() * dayMs;
              const week = Math.floor((first - start) / (7 * dayMs));
              return <span key={index} style={{ gridColumnStart: week + 1 }}>{name}</span>;
            })}
          </div>
          <div className={styles.calendarRows}>
            <div className={styles.weekdayLabels} aria-hidden="true">
              {(language === "id" ? weekdaysId : weekdays).map((name, index) =>
                <span key={name}>{index % 2 === 1 ? name : ""}</span>)}
            </div>
            <div className={styles.weeks}>
              {weeks.map((week, index) => <div className={styles.week} key={index}>
                {week.map((day, weekday) => day ? dayButton(day, "year") :
                  <span key={`${index}-${weekday}`} className={styles.blank} aria-hidden="true" />)}
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className={styles.monthView} data-calendar-view="month">
      <label className={styles.monthControl}>
        <span>{language === "id" ? "Bulan" : "Month"}</span>
        <select value={month} onChange={(event) => {
          const nextMonth = Number(event.target.value);
          setMonth(nextMonth);
          setSelectedDate(calendar.days.find((day) => Number(day.date.slice(5, 7)) - 1 === nextMonth)?.date ?? initialDate);
        }}>
          {monthNames.slice(0, Number(calendar.asOf.slice(5, 7))).map((name, index) =>
            <option key={index} value={index}>{name} {calendar.year}</option>)}
        </select>
      </label>
      <div className={styles.monthGrid}>
        {(language === "id" ? weekdaysId : weekdays).map((name) => <span className={styles.mobileWeekday} key={name}>{name}</span>)}
        {monthDays.map((day, index) => day ? dayButton(day, "month") :
          <span className={styles.mobileBlank} key={`blank-${index}`} aria-hidden="true" />)}
      </div>
    </div>
    <div className={styles.footer}>
      <p className={styles.detail} aria-live="polite">{selected ? countLabel(selected) : language === "id" ? "Belum ada kontribusi untuk tahun ini." : "No contributions yet this year."}</p>
      <div className={styles.legend} aria-label={language === "id" ? "Intensitas kontribusi dari sedikit ke banyak" : "Contribution intensity from less to more"}>
        <span>{language === "id" ? "Sedikit" : "Less"}</span>
        {[0, 1, 2, 3, 4].map((level) => <i key={level} data-level={level} aria-hidden="true" />)}
        <span>{language === "id" ? "Banyak" : "More"}</span>
      </div>
    </div>
    {hovered && hover ? <div className={styles.tooltip} style={{ left: hover.x, top: hover.y }} aria-hidden="true">{countLabel(hovered)}</div> : null}
  </div>;
}
