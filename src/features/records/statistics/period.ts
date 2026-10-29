import type { StatisticsDimension } from './types';

/** Translator signature exposed by `useI18n()`. */
export type Translator = (
  key: string,
  options?: Record<string, unknown>,
) => string;

export interface PeriodRange {
  /** Inclusive local midnight. */
  start: Date;
  /** Exclusive local midnight. */
  end: Date;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Truncates an instant to local midnight. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Adds whole calendar days (DST-safe because it starts from local midnight). */
export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

/** Monday-based start of the week. */
export function startOfWeek(date: Date): Date {
  const day = date.getDay(); // 0 = Sunday
  const offset = (day + 6) % 7; // Monday -> 0, Sunday -> 6
  return addDays(startOfDay(date), -offset);
}

/** First day of the month. */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** First day of the year. */
export function startOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

/** Number of days in a month. */
export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** Inclusive range covering the dimension that contains `anchor`. */
export function resolvePeriodRange(
  dimension: StatisticsDimension,
  anchor: Date,
): PeriodRange {
  if (dimension === 'week') {
    const start = startOfWeek(anchor);
    return { start, end: addDays(start, 7) };
  }

  if (dimension === 'month') {
    const start = startOfMonth(anchor);
    return {
      start,
      end: new Date(start.getFullYear(), start.getMonth() + 1, 1),
    };
  }

  const start = startOfYear(anchor);
  return { start, end: new Date(start.getFullYear() + 1, 0, 1) };
}

/** Steps the anchor one period forward (`delta > 0`) or backward. */
export function shiftPeriod(
  dimension: StatisticsDimension,
  anchor: Date,
  delta: number,
): Date {
  if (dimension === 'week') {
    return addDays(startOfWeek(anchor), delta * 7);
  }

  if (dimension === 'month') {
    return new Date(anchor.getFullYear(), anchor.getMonth() + delta, 1);
  }

  return new Date(anchor.getFullYear() + delta, 0, 1);
}

/** Every local day in `[start, end)`. */
export function eachDay({ start, end }: PeriodRange): Date[] {
  const days: Date[] = [];
  let cursor = startOfDay(start);

  while (cursor < end) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }

  return days;
}

/** Stable local-time key, e.g. `2026-11-11`. */
export function dayKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

/** 1-based week bucket inside a month (W1–W4 = 7 days, W5 = the remainder). */
export function weekIndexInMonth(date: Date): number {
  return Math.min(Math.ceil(date.getDate() / 7), 5);
}

export function isSameDay(a: Date, b: Date): boolean {
  return dayKey(a) === dayKey(b);
}

/** Difference in whole days (`b - a`). */
export function differenceInDays(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS);
}

/**
 * Localized period title for the navigator:
 * - Week:  `Nov 3 – Nov 9, 2026`
 * - Month: `Nov 2026`
 * - Year:  `2026`
 */
export function formatPeriodLabel(
  dimension: StatisticsDimension,
  range: PeriodRange,
  locale: string,
  t: Translator,
): string {
  const isChinese = locale.startsWith('zh');
  const startYear = range.start.getFullYear();
  const startMonth = range.start.getMonth();
  const endInclusive = addDays(range.end, -1);

  if (dimension === 'year') {
    return isChinese ? `${startYear}年` : String(startYear);
  }

  if (dimension === 'month') {
    const name = isChinese
      ? String(startMonth + 1)
      : t(`common.months.${startMonth}`);
    return isChinese ? `${startYear}年${name}月` : `${name} ${startYear}`;
  }

  if (isChinese) {
    return `${startYear}年${startMonth + 1}月${range.start.getDate()}日 – ${
      endInclusive.getMonth() + 1
    }月${endInclusive.getDate()}日`;
  }

  return `${t(`common.months.${startMonth}`)} ${range.start.getDate()} – ${t(
    `common.months.${endInclusive.getMonth()}`,
  )} ${endInclusive.getDate()}, ${startYear}`;
}

/** Short comparison caption, e.g. `Oct 2026` / `2025`. */
export function formatComparisonLabel(
  dimension: StatisticsDimension,
  range: PeriodRange,
  locale: string,
  t: Translator,
): string {
  const isChinese = locale.startsWith('zh');
  const year = range.start.getFullYear();
  const month = range.start.getMonth();

  if (dimension === 'year') {
    return isChinese ? `${year}年` : String(year);
  }

  const name = isChinese ? String(month + 1) : t(`common.months.${month}`);
  return isChinese ? `${year}年${name}月` : `${name} ${year}`;
}

/** Date-only caption used by heatmap cell details. */
export function formatDayLabel(
  date: Date,
  locale: string,
  t: Translator,
): string {
  if (locale.startsWith('zh')) {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }

  return `${t(`common.months.${date.getMonth()}`)} ${date.getDate()}`;
}

/** Range caption: one day, or `Nov 3 – Nov 9` when the cell spans a week. */
export function formatRangeLabel(
  start: Date,
  end: Date,
  locale: string,
  t: Translator,
): string {
  if (isSameDay(start, end)) {
    return formatDayLabel(start, locale, t);
  }

  const sameMonth = start.getMonth() === end.getMonth();
  const isChinese = locale.startsWith('zh');

  if (sameMonth) {
    return isChinese
      ? `${start.getMonth() + 1}月${start.getDate()}日 – ${end.getDate()}日`
      : `${t(`common.months.${start.getMonth()}`)} ${start.getDate()} – ${end.getDate()}`;
  }

  return `${formatDayLabel(start, locale, t)} – ${formatDayLabel(end, locale, t)}`;
}

/** Weekday caption, Monday first. */
export function formatWeekday(index: number, t: Translator): string {
  return t(`statistics.weekdays.${index}`);
}

/** Short month caption used by chart axes (`Jan` / `1月`). */
export function formatMonthName(
  monthIndex: number,
  locale: string,
  t: Translator,
): string {
  return locale.startsWith('zh')
    ? `${monthIndex + 1}月`
    : t(`common.months.${monthIndex}`);
}
