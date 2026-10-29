/** Sub-label under the day number, resolved to text by the caller (i18n). */
export type RecordDateLabel =
  | { kind: 'today' }
  | { kind: 'yesterday' }
  | { kind: 'month'; month: string }
  | { kind: 'yearMonth'; year: string; month: string };

export interface RecordTimeParts {
  /** Zero-padded day number shown large, e.g. `02` */
  day: string;
  /** `HH:mm` clock shown next to the date */
  clock: string;
  /** Second-line label under the day number */
  label: RecordDateLabel;
}

const pad2 = (value: number) => String(value).padStart(2, '0');

/** `yyyy-MM-dd` key for a calendar day in local time. */
const dayKey = (value: Date) =>
  `${value.getFullYear()}-${pad2(value.getMonth() + 1)}-${pad2(value.getDate())}`;

/**
 * Split a record's `Date` into the parts the feed header renders: day number,
 * clock, and the date sub-label. Parts come out in the device's local
 * timezone so "today"/"yesterday" match the user's wall clock.
 *
 * Label rules: 今天/昨天 for the latest two days, month-only for current-year
 * records (rendered by the caller as a localized month name), `yyyy/MM`
 * otherwise. Kept as a discriminated union (instead of finished strings) so
 * this util stays i18n-free.
 */
export function parseRecordTimeParts(
  date: Date,
  now: Date = new Date(),
): RecordTimeParts {
  // `getDate() - 1` can be 0 on the 1st of a month; the Date constructor
  // normalizes it to the previous month's last day (Nov 1 → Oct 31), so this
  // stays correct across month and year boundaries (also DST-safe).
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );

  const month = pad2(date.getMonth() + 1);
  const year = String(date.getFullYear());

  let label: RecordDateLabel;
  if (dayKey(date) === dayKey(now)) {
    label = { kind: 'today' };
  } else if (dayKey(date) === dayKey(yesterday)) {
    label = { kind: 'yesterday' };
  } else if (date.getFullYear() === now.getFullYear()) {
    label = { kind: 'month', month };
  } else {
    label = { kind: 'yearMonth', year, month };
  }

  return {
    day: pad2(date.getDate()),
    clock: `${pad2(date.getHours())}:${pad2(date.getMinutes())}`,
    label,
  };
}
