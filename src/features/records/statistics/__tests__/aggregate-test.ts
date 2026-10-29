import {
  aggregateMetrics,
  createStatisticsSnapshot,
  percentageChange,
} from '../aggregate';
import { dayKey } from '../period';
import type { DailyActivity } from '../types';

const emptyTypes = { text: 0, photo: 0, diary: 0, others: 0 };

/** Builds a fully-specified day; only the fields under test vary. */
function makeDay(
  date: Date,
  overrides: Partial<Omit<DailyActivity, 'date'>> = {},
): DailyActivity {
  return {
    date,
    records: 0,
    mood: null,
    moodEntries: 0,
    photos: 0,
    words: 0,
    types: emptyTypes,
    ...overrides,
  };
}

describe('aggregateMetrics', () => {
  it('sums counters and counts only days with records as active', () => {
    const metrics = aggregateMetrics([
      makeDay(new Date(2026, 10, 9), {
        records: 3,
        moodEntries: 1,
        photos: 2,
        words: 100,
      }),
      makeDay(new Date(2026, 10, 10), { records: 5, words: 50 }),
      makeDay(new Date(2026, 10, 11)),
    ]);

    expect(metrics).toEqual({
      records: 8,
      activeDays: 2,
      moodEntries: 1,
      photos: 2,
      words: 150,
    });
  });

  it('returns zeroes for an empty period', () => {
    expect(aggregateMetrics([])).toEqual({
      records: 0,
      activeDays: 0,
      moodEntries: 0,
      photos: 0,
      words: 0,
    });
  });
});

describe('percentageChange', () => {
  it('rounds to the nearest whole percent', () => {
    expect(percentageChange(12, 10)).toBe(20);
    expect(percentageChange(9, 10)).toBe(-10);
    expect(percentageChange(2, 3)).toBe(-33);
  });

  it('returns zero when both periods are empty', () => {
    expect(percentageChange(0, 0)).toBe(0);
  });

  it('cannot express growth from zero as a percentage', () => {
    expect(percentageChange(4, 0)).toBeNull();
  });

  it('rejects non-finite input', () => {
    expect(percentageChange(Number.NaN, 3)).toBeNull();
    expect(percentageChange(3, Number.POSITIVE_INFINITY)).toBeNull();
  });
});

describe('createStatisticsSnapshot — week', () => {
  const anchor = new Date(2026, 10, 11); // Wednesday, Nov 11 2026
  const activity = [
    makeDay(new Date(2026, 10, 9), { records: 2, mood: 4, moodEntries: 1 }),
    makeDay(new Date(2026, 10, 11), { records: 3, mood: 2, moodEntries: 2 }),
    // Outside the week (previous Sunday) — must not leak into the metrics.
    makeDay(new Date(2026, 10, 8), { records: 100 }),
    // Outside the week (next Monday) — must not leak in either.
    makeDay(new Date(2026, 10, 16), { records: 100 }),
  ];

  const snapshot = createStatisticsSnapshot('week', anchor, activity);

  it('uses the Monday-first range', () => {
    expect(dayKey(snapshot.start)).toBe('2026-11-09');
    expect(dayKey(snapshot.end)).toBe('2026-11-16');
  });

  it('emits one bar value per weekday, Monday first', () => {
    // Mon 2, Tue 0, Wed 3, then four inactive days.
    expect(snapshot.dailyRecords).toEqual([2, 0, 3, 0, 0, 0, 0]);
  });

  it('ignores activity outside the range', () => {
    expect(snapshot.metrics.records).toBe(5);
    expect(snapshot.metrics.activeDays).toBe(2);
  });

  it('keeps null mood days as gaps in the trend', () => {
    expect(snapshot.moodTrend).toHaveLength(7);
    expect(snapshot.moodTrend[0]).toEqual({
      value: 4,
      label: { kind: 'weekday', index: 0 },
    });
    expect(snapshot.moodTrend[2]).toEqual({
      value: 2,
      label: { kind: 'weekday', index: 2 },
    });
    expect(snapshot.moodTrend[1]?.value).toBeNull();
  });

  it('has no heatmap in week view', () => {
    expect(snapshot.heatmap).toBeNull();
  });
});

describe('createStatisticsSnapshot — month heatmap', () => {
  // November 2026 starts on a Sunday, so the first row is one day wide and the
  // grid needs six calendar weeks from Monday Oct 26.
  const month = createStatisticsSnapshot(
    'month',
    new Date(2026, 10, 11),
    [makeDay(new Date(2026, 10, 1), { records: 4 })],
  );

  const heatmap = month.heatmap!;

  it('buckets the month into Monday-first calendar weeks', () => {
    expect(heatmap.rowCount).toBe(6);
    expect(heatmap.columnCount).toBe(7);
    expect(heatmap.cells).toHaveLength(6);
  });

  it('marks slots outside the month as non-existent', () => {
    // Row 0: Mon Oct 26 … Sun Nov 1 — only the Sunday belongs to November.
    expect(heatmap.cells[0]).toEqual([null, null, null, null, null, null, 4]);
    expect(heatmap.meta[0]?.slice(0, 6)).toEqual([
      null,
      null,
      null,
      null,
      null,
      null,
    ]);
    expect(dayKey(heatmap.meta[0]![6]!.start)).toBe('2026-11-01');
  });

  it('fills unused days of the last week with zero activity, not null', () => {
    // The grid ends on Sunday Dec 6; only Nov 30 exists in November.
    const lastRow = heatmap.cells[5]!;
    expect(lastRow[0]).toBe(0);
    expect(lastRow[1]).toBeNull();
  });

  it('reports the largest real cell value', () => {
    expect(heatmap.max).toBe(4);
  });
});

describe('createStatisticsSnapshot — year heatmap', () => {
  const year = createStatisticsSnapshot(
    'year',
    new Date(2026, 10, 11),
    [
      makeDay(new Date(2026, 0, 3), { records: 2 }),
      makeDay(new Date(2026, 0, 4), { records: 3 }),
      makeDay(new Date(2026, 11, 30), { records: 1 }),
    ],
  );

  const heatmap = year.heatmap!;

  it('is a fixed 5 × 12 grid (week buckets × months)', () => {
    expect(heatmap.rowCount).toBe(5);
    expect(heatmap.columnCount).toBe(12);
    expect(heatmap.cells).toHaveLength(5);
    heatmap.cells.forEach((row) => expect(row).toHaveLength(12));
  });

  it('sums the days of each week bucket into one cell', () => {
    // Jan 3 (Saturday) and Jan 4 (Sunday) both fall into W1.
    expect(heatmap.cells[0]?.[0]).toBe(5);
  });

  it('leaves W5 non-existent for months shorter than 29 days', () => {
    expect(heatmap.cells[4]?.[1]).toBeNull(); // February 2026: 28 days
    expect(heatmap.cells[4]?.[0]).not.toBeNull(); // January: 31 days
  });

  it('labels every real cell with the days it spans', () => {
    const meta = heatmap.meta[4]![11]!; // December, W5
    expect(dayKey(meta.start)).toBe('2026-12-29');
    expect(dayKey(meta.end)).toBe('2026-12-31');
  });

  it('samples one mood point per month', () => {
    expect(year.moodTrend).toHaveLength(12);
    expect(year.moodTrend[0]?.label).toEqual({ kind: 'month', monthIndex: 0 });
    expect(year.moodTrend[11]?.label).toEqual({ kind: 'month', monthIndex: 11 });
  });
});

describe('createStatisticsSnapshot — mood aggregation', () => {
  const anchor = new Date(2026, 10, 11);

  it('weights every check-in, not every day, in the mood average', () => {
    const snapshot = createStatisticsSnapshot('week', anchor, [
      // Previous week: Nov 2–8, average mood 2.
      makeDay(new Date(2026, 10, 2), { mood: 2, moodEntries: 1 }),
      // Current week: Nov 9–15, average (5 * 3 + 1 * 1) / 4 = 4.
      makeDay(new Date(2026, 10, 9), { mood: 5, moodEntries: 3 }),
      makeDay(new Date(2026, 10, 10), { mood: 1, moodEntries: 1 }),
    ]);

    expect(snapshot.moodDeltaPct).toBe(100);
    // The distribution counts check-ins, so the 3 happy entries dominate.
    expect(snapshot.moodDistribution).toEqual([
      { key: 'happy', value: 3 },
      { key: 'calm', value: 0 },
      { key: 'anxious', value: 0 },
      { key: 'sad', value: 1 },
    ]);
  });

  it('buckets daily moods into the four distribution keys', () => {
    const snapshot = createStatisticsSnapshot('week', anchor, [
      makeDay(new Date(2026, 10, 9), { mood: 4.5, moodEntries: 1 }),
      makeDay(new Date(2026, 10, 10), { mood: 3.5, moodEntries: 2 }),
      makeDay(new Date(2026, 10, 11), { mood: 2.5, moodEntries: 3 }),
      makeDay(new Date(2026, 10, 12), { mood: 2.4, moodEntries: 4 }),
    ]);

    expect(snapshot.moodDistribution).toEqual([
      { key: 'happy', value: 1 },
      { key: 'calm', value: 2 },
      { key: 'anxious', value: 3 },
      { key: 'sad', value: 4 },
    ]);
  });

  it('compares the period mood against the previous period', () => {
    const snapshot = createStatisticsSnapshot('week', anchor, [
      // Previous week: Nov 2–8
      makeDay(new Date(2026, 10, 2), { mood: 2, moodEntries: 1 }),
      // Current week: Nov 9–15
      makeDay(new Date(2026, 10, 9), { mood: 3, moodEntries: 1 }),
    ]);

    expect(snapshot.moodDeltaPct).toBe(50);
  });

  it('omits the mood delta when a period has no mood data', () => {
    const snapshot = createStatisticsSnapshot('week', anchor, [
      makeDay(new Date(2026, 10, 9), { mood: 3, moodEntries: 1 }),
    ]);

    expect(snapshot.moodDeltaPct).toBeNull();
  });
});

describe('createStatisticsSnapshot — record types', () => {
  it('sums every type across the period', () => {
    const snapshot = createStatisticsSnapshot('week', new Date(2026, 10, 11), [
      makeDay(new Date(2026, 10, 9), {
        types: { text: 1, photo: 2, diary: 3, others: 4 },
      }),
      makeDay(new Date(2026, 10, 10), {
        types: { text: 10, photo: 0, diary: 0, others: 1 },
      }),
    ]);

    expect(snapshot.recordTypes).toEqual([
      { key: 'text', value: 11 },
      { key: 'photo', value: 2 },
      { key: 'diary', value: 3 },
      { key: 'others', value: 5 },
    ]);
  });
});
