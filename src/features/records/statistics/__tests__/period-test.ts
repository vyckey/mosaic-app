import {
  addDays,
  dayKey,
  differenceInDays,
  eachDay,
  formatPeriodLabel,
  formatRangeLabel,
  resolvePeriodRange,
  shiftPeriod,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  weekIndexInMonth,
  type Translator,
} from '../period';

/**
 * Minimal translator stub: the period helpers only depend on
 * `common.months.<index>` and `statistics.weekdays.<index>`.
 */
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const t: Translator = (key) => {
  const [namespace, name, index] = key.split('.');
  if (namespace === 'common' && name === 'months') {
    return MONTHS[Number(index)] ?? key;
  }
  return key;
};

// Wednesday, Nov 11 2026 — mid-week, mid-month, so every boundary is exercised.
const ANCHOR = new Date(2026, 10, 11);

describe('period boundaries', () => {
  it('truncates to local midnight', () => {
    const date = new Date(2026, 10, 11, 18, 42, 13);
    expect(dayKey(startOfDay(date))).toBe('2026-11-11');
  });

  it('starts the week on Monday', () => {
    // Sunday belongs to the week that started six days earlier.
    expect(dayKey(startOfWeek(new Date(2026, 10, 15)))).toBe('2026-11-09');
    expect(dayKey(startOfWeek(new Date(2026, 10, 9)))).toBe('2026-11-09');
  });

  it('resolves month and year starts', () => {
    expect(dayKey(startOfMonth(ANCHOR))).toBe('2026-11-01');
    expect(dayKey(startOfYear(ANCHOR))).toBe('2026-01-01');
  });

  it('counts days between two dates', () => {
    expect(differenceInDays(new Date(2026, 10, 1), new Date(2026, 10, 11))).toBe(
      10,
    );
    expect(addDays(new Date(2026, 10, 30), 2).getMonth()).toBe(11);
  });
});

describe('resolvePeriodRange', () => {
  it('covers Monday through the next Monday for a week', () => {
    const range = resolvePeriodRange('week', ANCHOR);
    expect(dayKey(range.start)).toBe('2026-11-09');
    expect(dayKey(range.end)).toBe('2026-11-16');
    expect(eachDay(range)).toHaveLength(7);
  });

  it('covers the calendar month', () => {
    const range = resolvePeriodRange('month', ANCHOR);
    expect(dayKey(range.start)).toBe('2026-11-01');
    expect(dayKey(range.end)).toBe('2026-12-01');
    expect(eachDay(range)).toHaveLength(30);
  });

  it('covers the calendar year', () => {
    const range = resolvePeriodRange('year', ANCHOR);
    expect(dayKey(range.start)).toBe('2026-01-01');
    expect(dayKey(range.end)).toBe('2027-01-01');
    expect(eachDay(range)).toHaveLength(365);
  });
});

describe('shiftPeriod', () => {
  it('steps weeks by seven days', () => {
    expect(dayKey(shiftPeriod('week', ANCHOR, -1))).toBe('2026-11-02');
    expect(dayKey(shiftPeriod('week', ANCHOR, 1))).toBe('2026-11-16');
  });

  it('rolls months across year boundaries', () => {
    expect(dayKey(shiftPeriod('month', ANCHOR, -11))).toBe('2025-12-01');
    expect(dayKey(shiftPeriod('month', ANCHOR, 2))).toBe('2027-01-01');
  });

  it('steps whole years', () => {
    expect(dayKey(shiftPeriod('year', ANCHOR, -1))).toBe('2025-01-01');
    expect(dayKey(shiftPeriod('year', ANCHOR, 1))).toBe('2027-01-01');
  });
});

describe('weekIndexInMonth', () => {
  it('groups days into 1-based week buckets', () => {
    expect(weekIndexInMonth(new Date(2026, 10, 1))).toBe(1);
    expect(weekIndexInMonth(new Date(2026, 10, 7))).toBe(1);
    expect(weekIndexInMonth(new Date(2026, 10, 8))).toBe(2);
    expect(weekIndexInMonth(new Date(2026, 10, 30))).toBe(5);
  });
});

describe('formatPeriodLabel', () => {
  it('formats each dimension in English', () => {
    const week = resolvePeriodRange('week', ANCHOR);
    const month = resolvePeriodRange('month', ANCHOR);
    const year = resolvePeriodRange('year', ANCHOR);

    expect(formatPeriodLabel('week', week, 'en', t)).toBe(
      'Nov 9 – Nov 15, 2026',
    );
    expect(formatPeriodLabel('month', month, 'en', t)).toBe('Nov 2026');
    expect(formatPeriodLabel('year', year, 'en', t)).toBe('2026');
  });

  it('formats each dimension in Chinese', () => {
    const week = resolvePeriodRange('week', ANCHOR);
    const month = resolvePeriodRange('month', ANCHOR);
    const year = resolvePeriodRange('year', ANCHOR);

    expect(formatPeriodLabel('week', week, 'zh-CN', t)).toBe(
      '2026年11月9日 – 11月15日',
    );
    expect(formatPeriodLabel('month', month, 'zh-CN', t)).toBe('2026年11月');
    expect(formatPeriodLabel('year', year, 'zh-CN', t)).toBe('2026年');
  });
});

describe('formatRangeLabel', () => {
  it('collapses a single day', () => {
    expect(formatRangeLabel(ANCHOR, ANCHOR, 'en', t)).toBe('Nov 11');
  });

  it('uses a compact form inside one month', () => {
    expect(
      formatRangeLabel(new Date(2026, 10, 9), new Date(2026, 10, 15), 'en', t),
    ).toBe('Nov 9 – 15');
  });

  it('repeats the month when the range crosses one', () => {
    expect(
      formatRangeLabel(new Date(2026, 10, 30), new Date(2026, 11, 6), 'en', t),
    ).toBe('Nov 30 – Dec 6');
  });
});
