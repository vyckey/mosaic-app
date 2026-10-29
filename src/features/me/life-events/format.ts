import type { LifeEvent, LifeEventDate, LifeEventStats } from './types';

/** i18n translator signature (from `useI18n`) */
export type Translate = (
  key: string,
  options?: Record<string, unknown>,
) => string;

const pad2 = (value: number) => String(value).padStart(2, '0');

/**
 * Sortable instant of a life event date. Unknown parts collapse to the start
 * of their period (year → Jan 1, month → 1st), so events keep a stable order
 * without inventing a precise day.
 */
export function lifeEventTimestamp(date: LifeEventDate): number {
  return new Date(date.year, (date.month ?? 1) - 1, date.day ?? 1).getTime();
}

/** Interpolation values shared by every date template (unused ones are ignored) */
function dateTemplateValues(date: LifeEventDate) {
  const month = date.month;
  return {
    year: String(date.year),
    start: date.year,
    end: date.endYear ?? date.year,
    month: month ? pad2(month) : '',
    monthName: month ? `common.months.${month - 1}` : '',
    day: date.day ?? 1,
  };
}

/**
 * Full date label for the detail page (year included).
 * Templates pick what they need: English uses the localized month name while
 * Chinese renders `2020 年 6 月`.
 */
export function formatLifeEventDate(date: LifeEventDate, t: Translate): string {
  const values = dateTemplateValues(date);

  switch (date.precision) {
    case 'year':
      return t('lifeEvents.date.year', values);
    case 'month':
      return t('lifeEvents.date.month', {
        ...values,
        monthName: t(values.monthName as string),
      });
    case 'day':
      return t('lifeEvents.date.day', {
        ...values,
        monthName: t(values.monthName as string),
      });
    case 'range':
      return t('lifeEvents.date.range', values);
  }
}

/**
 * Short date label for the timeline: the year lives in the group header, so
 * this only renders the month/day/period part. Year-precision events return an
 * empty string (nothing left to show next to the group header).
 */
export function formatLifeEventDayLabel(
  date: LifeEventDate,
  t: Translate,
): string {
  const values = dateTemplateValues(date);

  switch (date.precision) {
    case 'year':
      return '';
    case 'month':
      return t('lifeEvents.date.monthOnly', {
        ...values,
        monthName: t(values.monthName as string),
      });
    case 'day':
      return t('lifeEvents.date.monthDayOnly', {
        ...values,
        monthName: t(values.monthName as string),
      });
    case 'range':
      return t('lifeEvents.date.range', values);
  }
}

/** One year group of the timeline */
export interface LifeEventYearGroup {
  year: number;
  events: LifeEvent[];
}

/**
 * Sort by event date and group by start year. Groups share the same order as
 * the events inside them (`desc` = newest first, the default).
 */
export function groupLifeEventsByYear(
  events: LifeEvent[],
  order: 'desc' | 'asc' = 'desc',
): LifeEventYearGroup[] {
  const sorted = [...events].sort((a, b) => {
    const delta = lifeEventTimestamp(a.date) - lifeEventTimestamp(b.date);
    return order === 'desc' ? -delta : delta;
  });

  const groups: LifeEventYearGroup[] = [];
  for (const event of sorted) {
    const year = event.date.year;
    const current = groups[groups.length - 1];
    if (current && current.year === year) {
      current.events.push(event);
    } else {
      groups.push({ year, events: [event] });
    }
  }

  return groups;
}

/**
 * Overview metrics, computed from the real event list — never fabricated.
 * `years` is the span from the earliest recorded year to today.
 */
export function computeLifeEventStats(
  events: LifeEvent[],
  now: Date = new Date(),
): LifeEventStats {
  if (events.length === 0) {
    return { events: 0, stages: 0, years: 0 };
  }

  const earliestYear = Math.min(...events.map((event) => event.date.year));
  const stageKeys = new Set(events.map((event) => event.stage).filter(Boolean));

  return {
    events: events.length,
    stages: stageKeys.size,
    years: Math.max(0, now.getFullYear() - earliestYear),
  };
}

/** Match an event against the search query (title / description / year). */
export function matchesLifeEventQuery(
  event: LifeEvent,
  query: string,
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return [
    event.title,
    event.description ?? '',
    event.location ?? '',
    String(event.date.year),
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalized);
}
