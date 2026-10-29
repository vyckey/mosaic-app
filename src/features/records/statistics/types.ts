/** Granularity of the Statistics screen. */
export type StatisticsDimension = 'week' | 'month' | 'year';

/** Record categories used by the month-only type distribution chart. */
export type RecordTypeKey = 'text' | 'photo' | 'diary' | 'others';

/** Mood buckets used by the distribution ring. */
export type MoodKey = 'happy' | 'calm' | 'anxious' | 'sad';

/**
 * One calendar day of aggregated activity.
 *
 * The mock data source produces these; real storage can map its own records to
 * the same shape without changing the statistics layer.
 */
export interface DailyActivity {
  /** Local midnight of the day. */
  date: Date;
  records: number;
  /** Average mood (1–5) for the day; `null` when no mood was recorded. */
  mood: number | null;
  moodEntries: number;
  photos: number;
  words: number;
  types: Record<RecordTypeKey, number>;
}

/** Summed counters shown in the metric cards. */
export interface StatisticsMetrics {
  records: number;
  activeDays: number;
  moodEntries: number;
  photos: number;
  words: number;
}

/** One x-axis slot of the mood trend line. */
export interface MoodTrendPoint {
  /** Average mood for the slot; `null` when the slot has no mood entries. */
  value: number | null;
  /**
   * Structural caption, resolved by the screen with i18n:
   * - `weekday`: 0 = Monday … 6 = Sunday
   * - `day`: a concrete date inside the period
   * - `month`: 0 = January … 11 = December
   */
  label:
    | { kind: 'weekday'; index: number }
    | { kind: 'day'; monthIndex: number; day: number }
    | { kind: 'month'; monthIndex: number };
}

/** Legend row of the mood / record-type distributions. */
export interface DistributionDatum {
  key: string;
  value: number;
}

/** Metadata of a pressable heatmap cell. */
export interface HeatmapCellMeta {
  /** Inclusive first day covered by this cell. */
  start: Date;
  /** Inclusive last day covered by this cell. */
  end: Date;
}

/** Heatmap payload with both values and the dates behind them. */
export interface StatisticsHeatmap {
  /** Row-major values; `null` marks a slot outside the period. */
  cells: (number | null)[][];
  /** Same shape as `cells`; `null` for non-existent slots. */
  meta: (HeatmapCellMeta | null)[][];
  /** Largest real cell value (used as the linear scale bound). */
  max: number;
  rowCount: number;
  columnCount: number;
}

/** Everything the Statistics screen needs for one period. */
export interface StatisticsSnapshot {
  dimension: StatisticsDimension;
  /** Inclusive start of the displayed period. */
  start: Date;
  /** Exclusive end of the displayed period. */
  end: Date;
  metrics: StatisticsMetrics;
  previousMetrics: StatisticsMetrics;
  /** Percentage change vs the previous period; `null` when it cannot be shown. */
  recordsDeltaPct: number | null;
  moodDeltaPct: number | null;
  /** Week-only: one value per weekday (Monday first). */
  dailyRecords: number[];
  heatmap: StatisticsHeatmap | null;
  recordTypes: DistributionDatum[];
  moodTrend: MoodTrendPoint[];
  moodDistribution: DistributionDatum[];
}

/** Photos shown in the Year in Review card. */
export const yearReviewPhotos = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
  'https://images.unsplash.com/photo-1492571351-7edd92c04e6d?w=400&q=80',
  'https://images.unsplash.com/photo-1528360983277-13d9b152c6d1?w=400&q=80',
] as const;
