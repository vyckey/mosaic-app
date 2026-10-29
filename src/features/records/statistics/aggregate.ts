import {
  addDays,
  dayKey,
  daysInMonth,
  differenceInDays,
  eachDay,
  resolvePeriodRange,
  shiftPeriod,
  startOfDay,
  startOfWeek,
  weekIndexInMonth,
} from './period';
import type {
  DailyActivity,
  DistributionDatum,
  HeatmapCellMeta,
  MoodKey,
  MoodTrendPoint,
  RecordTypeKey,
  StatisticsDimension,
  StatisticsHeatmap,
  StatisticsMetrics,
  StatisticsSnapshot,
} from './types';

const RECORD_TYPE_KEYS: RecordTypeKey[] = ['text', 'photo', 'diary', 'others'];
const MOOD_KEYS: MoodKey[] = ['happy', 'calm', 'anxious', 'sad'];

/** Aggregates the counters shown in the metric cards. */
export function aggregateMetrics(days: readonly DailyActivity[]): StatisticsMetrics {
  return days.reduce<StatisticsMetrics>(
    (metrics, day) => ({
      records: metrics.records + day.records,
      activeDays: metrics.activeDays + (day.records > 0 ? 1 : 0),
      moodEntries: metrics.moodEntries + day.moodEntries,
      photos: metrics.photos + day.photos,
      words: metrics.words + day.words,
    }),
    { records: 0, activeDays: 0, moodEntries: 0, photos: 0, words: 0 },
  );
}

/** Mood entries are weighted so a day with two check-ins counts twice. */
function averageMood(days: readonly DailyActivity[]): number | null {
  let weightedSum = 0;
  let weight = 0;

  for (const day of days) {
    if (day.mood === null || day.moodEntries <= 0) {
      continue;
    }
    weightedSum += day.mood * day.moodEntries;
    weight += day.moodEntries;
  }

  return weight > 0 ? weightedSum / weight : null;
}

/** Rounded percentage change; `null` when a percentage would be misleading. */
export function percentageChange(
  current: number,
  previous: number,
): number | null {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) {
    return null;
  }
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }
  return Math.round(((current - previous) / previous) * 100);
}

function createDayLookup(
  activity: readonly DailyActivity[],
): Map<string, DailyActivity> {
  return new Map(activity.map((day) => [dayKey(day.date), day]));
}

/** Month heatmap: calendar weeks (Mon–Sun) intersected with the month. */
function buildMonthHeatmap(
  year: number,
  monthIndex: number,
  lookup: Map<string, DailyActivity>,
): StatisticsHeatmap {
  const monthStart = new Date(year, monthIndex, 1);
  const monthEnd = new Date(year, monthIndex + 1, 1);
  const gridStart = startOfWeek(monthStart);
  const rowCount = Math.ceil(differenceInDays(gridStart, monthEnd) / 7);

  const cells: (number | null)[][] = [];
  const meta: (HeatmapCellMeta | null)[][] = [];
  let max = 0;

  for (let row = 0; row < rowCount; row += 1) {
    const rowCells: (number | null)[] = [];
    const rowMeta: (HeatmapCellMeta | null)[] = [];

    for (let column = 0; column < 7; column += 1) {
      const date = addDays(gridStart, row * 7 + column);

      if (date < monthStart || date >= monthEnd) {
        rowCells.push(null);
        rowMeta.push(null);
        continue;
      }

      const value = lookup.get(dayKey(date))?.records ?? 0;
      max = Math.max(max, value);
      rowCells.push(value);
      rowMeta.push({ start: date, end: date });
    }

    cells.push(rowCells);
    meta.push(rowMeta);
  }

  return { cells, meta, max, rowCount, columnCount: 7 };
}

/** Year heatmap: fixed 5 week-buckets × 12 months. */
function buildYearHeatmap(
  year: number,
  lookup: Map<string, DailyActivity>,
): StatisticsHeatmap {
  const rowCount = 5;
  const columnCount = 12;
  const cells: (number | null)[][] = Array.from({ length: rowCount }, () =>
    Array.from({ length: columnCount }, () => 0),
  );
  const meta: (HeatmapCellMeta | null)[][] = Array.from({ length: rowCount }, () =>
    Array.from({ length: columnCount }, () => null),
  );

  let max = 0;

  for (let monthIndex = 0; monthIndex < columnCount; monthIndex += 1) {
    const days = eachDay({
      start: new Date(year, monthIndex, 1),
      end: new Date(year, monthIndex + 1, 1),
    });

    for (const date of days) {
      const row = weekIndexInMonth(date) - 1;
      const value = lookup.get(dayKey(date))?.records ?? 0;

      cells[row][monthIndex] = (cells[row][monthIndex] ?? 0) + value;
      max = Math.max(max, cells[row][monthIndex] ?? 0);

      const existing = meta[row][monthIndex];
      meta[row][monthIndex] = {
        start: existing?.start ?? date,
        end: date,
      };
    }
  }

  // A month with fewer than 29 days has no W5: mark those slots as non-existent.
  for (let monthIndex = 0; monthIndex < columnCount; monthIndex += 1) {
    if (daysInMonth(year, monthIndex) < 29) {
      cells[rowCount - 1][monthIndex] = null;
    }
  }

  return { cells, meta, max, rowCount, columnCount };
}

function collectRecordTypes(days: readonly DailyActivity[]): DistributionDatum[] {
  const totals: Record<RecordTypeKey, number> = {
    text: 0,
    photo: 0,
    diary: 0,
    others: 0,
  };

  for (const day of days) {
    for (const key of RECORD_TYPE_KEYS) {
      totals[key] += day.types[key];
    }
  }

  return RECORD_TYPE_KEYS.map((key) => ({ key, value: totals[key] }));
}

function collectMoodDistribution(
  days: readonly DailyActivity[],
): DistributionDatum[] {
  const totals: Record<MoodKey, number> = {
    happy: 0,
    calm: 0,
    anxious: 0,
    sad: 0,
  };

  for (const day of days) {
    if (day.mood === null || day.moodEntries <= 0) {
      continue;
    }

    const key: MoodKey =
      day.mood >= 4.5
        ? 'happy'
        : day.mood >= 3.5
          ? 'calm'
          : day.mood >= 2.5
            ? 'anxious'
            : 'sad';

    totals[key] += day.moodEntries;
  }

  return MOOD_KEYS.map((key) => ({ key, value: totals[key] }));
}

function buildWeekMoodTrend(
  days: readonly (DailyActivity | null)[],
): MoodTrendPoint[] {
  return days.slice(0, 7).map((day, index) => ({
    value: day?.mood ?? null,
    label: { kind: 'weekday', index },
  }));
}

function buildMonthMoodTrend(
  year: number,
  monthIndex: number,
  lookup: Map<string, DailyActivity>,
): MoodTrendPoint[] {
  const length = daysInMonth(year, monthIndex);
  // Weekly samples: 1 / 8 / 15 / 22 / last day.
  const starts = Array.from(
    new Set([0, 7, 14, 21, length - 1].filter((day) => day < length)),
  );

  return starts.map((startDay) => {
    const windowStart = new Date(year, monthIndex, startDay + 1);
    const windowEnd = new Date(year, monthIndex, startDay + 8);
    const days = eachDay({ start: windowStart, end: windowEnd }).map(
      (date) => lookup.get(dayKey(date)) ?? null,
    );

    return {
      value: averageMood(days.filter((day): day is DailyActivity => day !== null)),
      label: { kind: 'day', monthIndex, day: startDay + 1 },
    };
  });
}

function buildYearMoodTrend(
  year: number,
  lookup: Map<string, DailyActivity>,
): MoodTrendPoint[] {
  return Array.from({ length: 12 }, (_, monthIndex) => {
    const days = eachDay({
      start: new Date(year, monthIndex, 1),
      end: new Date(year, monthIndex + 1, 1),
    })
      .map((date) => lookup.get(dayKey(date)) ?? null)
      .filter((day): day is DailyActivity => day !== null);

    return {
      value: averageMood(days),
      label: { kind: 'month', monthIndex },
    };
  });
}

/**
 * Builds every derived value for one Statistics period.
 *
 * Pure by design: callers pass a daily activity list and receive numbers,
 * structural labels and heatmap grids. Date bucketing lives here — never in
 * `MosaicHeatmap`, which stays a display-only component.
 */
export function createStatisticsSnapshot(
  dimension: StatisticsDimension,
  anchor: Date,
  activity: readonly DailyActivity[],
): StatisticsSnapshot {
  const range = resolvePeriodRange(dimension, anchor);
  const previousRange = resolvePeriodRange(
    dimension,
    shiftPeriod(dimension, anchor, -1),
  );
  const lookup = createDayLookup(activity);

  const days = eachDay(range).map((date) => lookup.get(dayKey(date)) ?? null);
  const previousDays = eachDay(previousRange).map(
    (date) => lookup.get(dayKey(date)) ?? null,
  );
  const presentDays = days.filter((day): day is DailyActivity => day !== null);
  const previousPresentDays = previousDays.filter(
    (day): day is DailyActivity => day !== null,
  );

  const metrics = aggregateMetrics(presentDays);
  const previousMetrics = aggregateMetrics(previousPresentDays);
  const currentMood = averageMood(presentDays);
  const previousMood = averageMood(previousPresentDays);

  let heatmap: StatisticsHeatmap | null = null;
  if (dimension === 'month') {
    heatmap = buildMonthHeatmap(
      range.start.getFullYear(),
      range.start.getMonth(),
      lookup,
    );
  } else if (dimension === 'year') {
    heatmap = buildYearHeatmap(range.start.getFullYear(), lookup);
  }

  let moodTrend: MoodTrendPoint[] = [];
  if (dimension === 'week') {
    moodTrend = buildWeekMoodTrend(days);
  } else if (dimension === 'month') {
    moodTrend = buildMonthMoodTrend(
      range.start.getFullYear(),
      range.start.getMonth(),
      lookup,
    );
  } else {
    moodTrend = buildYearMoodTrend(range.start.getFullYear(), lookup);
  }

  return {
    dimension,
    start: range.start,
    end: range.end,
    metrics,
    previousMetrics,
    recordsDeltaPct: percentageChange(
      metrics.records,
      previousMetrics.records,
    ),
    moodDeltaPct:
      currentMood !== null && previousMood !== null
        ? percentageChange(currentMood, previousMood)
        : null,
    dailyRecords:
      dimension === 'week'
        ? days.map((day) => day?.records ?? 0)
        : [],
    heatmap,
    recordTypes: collectRecordTypes(presentDays),
    moodTrend,
    moodDistribution: collectMoodDistribution(presentDays),
  };
}

/** Empty snapshot shape used for safe fallbacks. */
export const emptyMetrics: StatisticsMetrics = {
  records: 0,
  activeDays: 0,
  moodEntries: 0,
  photos: 0,
  words: 0,
};

/** Exposed for tests: the local date normalized to midnight. */
export const normalizeDate = startOfDay;
