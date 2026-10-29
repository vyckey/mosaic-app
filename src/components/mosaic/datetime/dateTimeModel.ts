import type { WheelColumn, WheelValue } from '../wheel/MosaicWheelColumn';

export type DateTimeMode = 'date' | 'time' | 'datetime';

/** `h23` shows 00–23; `h12` shows 1–12 plus an AM / PM column. */
export type HourCycle = 'h12' | 'h23';

export type DayPeriod = 'am' | 'pm';

export interface DateTimeParts {
  year: number;
  /** 1-12 */
  month: number;
  /** 1-31 */
  day: number;
  hour: number;
  minute: number;
}

/** Fallback year span when a caller supplies no bound. */
const DEFAULT_PAST_YEARS = 100;
const DEFAULT_FUTURE_YEARS = 10;

/** Minute intervals a clock can actually be divided into (1–30, divides 60). */
const MINUTE_DIVISORS = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30] as const;

export function daysInMonth(year: number, month: number): number {
  // Day 0 of the next month is the last day of this one.
  return new Date(year, month, 0).getDate();
}

export function readDateTimeParts(date: Date): DateTimeParts {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}

/**
 * Rounds an arbitrary interval to the nearest usable one. A wheel can only
 * land on values that divide the hour, so `7` becomes `6` instead of producing
 * a column that drifts away from the clock.
 */
export function normalizeMinuteInterval(interval: number): number {
  if (!Number.isFinite(interval)) {
    return 1;
  }

  const whole = Math.round(interval);

  if (whole <= 1) {
    return 1;
  }

  if (whole >= 30) {
    return 30;
  }

  return MINUTE_DIVISORS.reduce((best, candidate) =>
    Math.abs(candidate - whole) < Math.abs(best - whole) ? candidate : best,
  );
}

/** Rounds a minute onto the interval grid, staying inside 0–59. */
export function snapMinute(minute: number, interval: number): number {
  const step = normalizeMinuteInterval(interval);
  const snapped = Math.round(minute / step) * step;

  return snapped >= 60 ? 60 - step : snapped;
}

function isEarlierDay(a: DateTimeParts, b: DateTimeParts): boolean {
  if (a.year !== b.year) {
    return a.year < b.year;
  }
  if (a.month !== b.month) {
    return a.month < b.month;
  }
  return a.day < b.day;
}

export interface ComposeDateTimeOptions {
  /** Value the missing parts are read from; also the source of seconds / ms. */
  base: Date;
  /** Parts chosen by the user. Anything omitted keeps the base value. */
  patch?: Partial<DateTimeParts>;
  mode?: DateTimeMode;
  minuteInterval?: number;
  minimumDate?: Date;
  maximumDate?: Date;
}

/**
 * Builds a calendar-valid `Date` from wheel parts and clamps it into range.
 *
 * Two rules make the wheel feel like a native picker:
 * - an impossible day rolls back to the last day of the month (31 Jan → 29 Feb
 *   in a leap year) instead of overflowing into March;
 * - bounds apply to the calendar day only. The time part of `minimumDate` /
 *   `maximumDate` is ignored, so a date-only bound never rewrites the clock.
 */
export function composeDateTime({
  base,
  patch,
  mode = 'datetime',
  minuteInterval = 1,
  minimumDate,
  maximumDate,
}: ComposeDateTimeOptions): Date {
  const next: DateTimeParts = { ...readDateTimeParts(base), ...patch };

  if (mode !== 'time') {
    const lower = minimumDate ? readDateTimeParts(minimumDate) : null;
    const upper = maximumDate ? readDateTimeParts(maximumDate) : null;

    // Two passes: clamping into range can land on a shorter month, and
    // shortening the month can push the day back out of range again.
    for (let pass = 0; pass < 2; pass += 1) {
      if (lower && isEarlierDay(next, lower)) {
        next.year = lower.year;
        next.month = lower.month;
        next.day = lower.day;
      }

      if (upper && isEarlierDay(upper, next)) {
        next.year = upper.year;
        next.month = upper.month;
        next.day = upper.day;
      }

      next.day = Math.min(next.day, daysInMonth(next.year, next.month));
    }
  }

  if (mode !== 'date') {
    next.minute = snapMinute(next.minute, minuteInterval);
  }

  return new Date(
    next.year,
    next.month - 1,
    next.day,
    next.hour,
    next.minute,
    base.getSeconds(),
    base.getMilliseconds(),
  );
}

export interface DateTimeWheelModel {
  /** Value clamped into range and snapped to the minute grid. */
  date: Date;
  columns: WheelColumn[];
  /** Map consumed by `MosaicWheelPicker`. */
  values: Record<string, WheelValue>;
}

export interface BuildDateTimeModelOptions {
  value: Date;
  mode?: DateTimeMode;
  hourCycle?: HourCycle;
  minuteInterval?: number;
  minimumDate?: Date;
  maximumDate?: Date;
  /** Localized short month names, January first. */
  monthNames: readonly string[];
  dayPeriods: Record<DayPeriod, string>;
  /**
   * Wrap every wheel around, like a native picker: December → January, 23 → 00,
   * 31 → 1. Columns narrowed by a bound still loop, just within their allowed
   * range — the range itself never grows.
   */
  loop?: boolean;
  /** Unit appended to every row, e.g. `年`. Empty strings hide it. */
  units?: Partial<Record<'year' | 'day' | 'hour' | 'minute', string>>;
  /** Accessible names of the columns. */
  labels?: Partial<
    Record<'year' | 'month' | 'day' | 'hour' | 'minute' | 'period', string>
  >;
}

function range(from: number, to: number): number[] {
  if (to < from) {
    return [];
  }

  return Array.from({ length: to - from + 1 }, (_, offset) => from + offset);
}

const pad2 = (value: number) => String(value).padStart(2, '0');

/**
 * Turns a `Date` into columns and a value map for `MosaicWheelPicker`.
 *
 * The columns are rebuilt on every value change on purpose: the days column
 * depends on the selected month, and the month column depends on the selected
 * year, so the wheels stay honest instead of offering 31 February.
 */
export function buildDateTimeModel({
  value,
  mode = 'datetime',
  hourCycle = 'h23',
  minuteInterval = 1,
  minimumDate,
  maximumDate,
  monthNames,
  dayPeriods,
  loop = true,
  units = {},
  labels = {},
}: BuildDateTimeModelOptions): DateTimeWheelModel {
  const date = composeDateTime({
    base: value,
    mode,
    minuteInterval,
    minimumDate,
    maximumDate,
  });
  const parts = readDateTimeParts(date);

  const lower = minimumDate ? readDateTimeParts(minimumDate) : null;
  const upper = maximumDate ? readDateTimeParts(maximumDate) : null;

  const columns: WheelColumn[] = [];
  const values: Record<string, WheelValue> = {};

  if (mode !== 'time') {
    const thisYear = new Date().getFullYear();
    const firstYear = Math.min(
      lower ? lower.year : thisYear - DEFAULT_PAST_YEARS,
      parts.year,
    );
    const lastYear = Math.max(
      upper ? upper.year : thisYear + DEFAULT_FUTURE_YEARS,
      parts.year,
    );

    const firstMonth = lower && parts.year === lower.year ? lower.month : 1;
    const lastMonth = upper && parts.year === upper.year ? upper.month : 12;

    const firstDay =
      lower && parts.year === lower.year && parts.month === lower.month
        ? lower.day
        : 1;
    const lastDay = Math.max(
      firstDay,
      Math.min(
        daysInMonth(parts.year, parts.month),
        upper && parts.year === upper.year && parts.month === upper.month
          ? upper.day
          : 31,
      ),
    );

    columns.push(
      {
        key: 'year',
        label: labels.year,
        items: range(firstYear, lastYear).map((year) => ({
          value: year,
          label: String(year),
        })),
        suffix: units.year,
        loop,
        flex: 1.3,
      },
      {
        key: 'month',
        label: labels.month,
        items: range(firstMonth, lastMonth).map((month) => ({
          value: month,
          label: monthNames[month - 1] ?? String(month),
        })),
        loop,
        flex: 1.1,
      },
      {
        key: 'day',
        label: labels.day,
        items: range(firstDay, lastDay).map((day) => ({
          value: day,
          label: String(day),
        })),
        suffix: units.day,
        loop,
        flex: 0.9,
      },
    );

    values.year = parts.year;
    values.month = parts.month;
    values.day = parts.day;
  }

  if (mode !== 'date') {
    const hour12 = ((parts.hour + 11) % 12) + 1;

    columns.push({
      key: 'hour',
      label: labels.hour,
      items:
        hourCycle === 'h12'
          ? range(1, 12).map((hour) => ({ value: hour, label: String(hour) }))
          : range(0, 23).map((hour) => ({ value: hour, label: pad2(hour) })),
      suffix: units.hour,
      loop,
      flex: 0.9,
    });

    columns.push({
      key: 'minute',
      label: labels.minute,
      items: range(0, 59)
        .filter((minute) => minute % normalizeMinuteInterval(minuteInterval) === 0)
        .map((minute) => ({ value: minute, label: pad2(minute) })),
      suffix: units.minute,
      loop,
      flex: 0.9,
    });

    values.minute = parts.minute;

    if (hourCycle === 'h12') {
      columns.push({
        key: 'period',
        label: labels.period,
        items: [
          { value: 'am', label: dayPeriods.am },
          { value: 'pm', label: dayPeriods.pm },
        ],
        loop,
        flex: 0.85,
      });

      values.hour = hour12;
      values.period = parts.hour < 12 ? 'am' : 'pm';
    } else {
      values.hour = parts.hour;
    }
  }

  return { date, columns, values };
}
