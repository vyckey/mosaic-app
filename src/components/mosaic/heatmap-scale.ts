/**
 * Pure value-mapping helpers for `MosaicHeatmap`.
 *
 * This module deliberately knows nothing about dates or business metrics:
 * callers pass an already-aggregated 2D grid, and it only turns values into
 * color-ramp levels.
 */

/**
 * A heatmap cell value:
 * - `null` / `undefined`: the slot does not exist (e.g. a day outside the
 *   displayed month). Rendered transparent and not pressable.
 * - `0` (or a negative number, clamped to 0): the slot exists but has no
 *   activity. Rendered with the lowest color of the ramp.
 * - positive number: activity intensity.
 *
 * `NaN` / `Infinity` are treated as `null`.
 */
export type MosaicHeatmapValue = number | null | undefined;

/** How positive values are bucketed into the color ramp. */
export type MosaicHeatmapScale = 'linear' | 'quantile' | 'thresholds';

/** Normalizes a raw cell value: invalid numbers → `null`, negatives → `0`. */
export function normalizeHeatmapValue(
  raw: MosaicHeatmapValue,
): number | null {
  if (typeof raw !== 'number' || !Number.isFinite(raw)) {
    return null;
  }

  return Math.max(raw, 0);
}

export interface HeatmapLevelResolver {
  /** Effective strategy (including `thresholds` auto-detection). */
  scale: MosaicHeatmapScale;
  /** Resolved upper bound; only meaningful for `linear`. */
  max: number;
  /** Maps a normalized value to `0 .. steps`. */
  levelOf: (value: number | null) => number;
}

export interface CreateHeatmapLevelResolverOptions {
  data: readonly (readonly MosaicHeatmapValue[])[];
  /** Number of activity steps, i.e. `colorRamp.length - 1`. */
  steps: number;
  /** Upper bound for `linear`; ignored by the other strategies. */
  max?: number;
  /** Defaults to `'thresholds'` when `thresholds` is provided. */
  scale?: MosaicHeatmapScale;
  /** Strictly increasing upper bounds for `scale="thresholds"`. */
  thresholds?: readonly number[];
}

function computeDataMax(
  data: readonly (readonly MosaicHeatmapValue[])[],
): number {
  let max = 0;

  for (const row of data) {
    for (const raw of row) {
      const value = normalizeHeatmapValue(raw);
      if (value !== null && value > max) {
        max = value;
      }
    }
  }

  return max;
}

function validateThresholds(
  thresholds: readonly number[],
  activeSteps: number,
): void {
  // N thresholds split the activity range into N + 1 levels.
  if (thresholds.length !== activeSteps - 1) {
    throw new Error(
      `MosaicHeatmap: \`thresholds\` must contain exactly ${Math.max(
        activeSteps - 1,
        0,
      )} entries for ${activeSteps} activity level(s); received ${
        thresholds.length
      }.`,
    );
  }

  thresholds.forEach((threshold, index) => {
    if (!Number.isFinite(threshold) || threshold < 0) {
      throw new Error(
        'MosaicHeatmap: `thresholds` must be finite non-negative numbers.',
      );
    }

    if (index > 0 && threshold <= thresholds[index - 1]) {
      throw new Error(
        'MosaicHeatmap: `thresholds` must be strictly increasing.',
      );
    }
  });
}

/**
 * Builds the level resolver for a grid.
 *
 * Strategies:
 * - `linear`: equal-width buckets over `[0, max]`; values above `max` saturate.
 * - `quantile`: true quantile boundaries over every positive data point.
 *   Equal values always share a level (ties are never split).
 * - `thresholds`: caller-defined upper bounds; a value above N thresholds
 *   lands on level `N + 1`.
 */
export function createHeatmapLevelResolver({
  data,
  steps,
  max,
  scale,
  thresholds,
}: CreateHeatmapLevelResolverOptions): HeatmapLevelResolver {
  const activeSteps = Math.max(Math.trunc(steps), 1);
  const dataMax = computeDataMax(data);

  if (max !== undefined && (!Number.isFinite(max) || max < 0)) {
    throw new Error(
      'MosaicHeatmap: `max` must be a finite non-negative number.',
    );
  }

  const resolvedScale: MosaicHeatmapScale =
    scale ?? (thresholds && thresholds.length > 0 ? 'thresholds' : 'linear');

  // `max` only participates in linear bucketing; the other strategies derive
  // their boundaries from the data or from explicit thresholds.
  const resolvedMax = resolvedScale === 'linear' ? (max ?? dataMax) : dataMax;

  if (resolvedScale === 'linear' && resolvedMax === 0 && dataMax > 0) {
    throw new Error(
      'MosaicHeatmap: `max` must be greater than 0 when the data contains positive values.',
    );
  }

  let normalizedThresholds: readonly number[] = [];
  if (resolvedScale === 'thresholds') {
    if (thresholds === undefined) {
      throw new Error(
        'MosaicHeatmap: `thresholds` are required when `scale` is "thresholds".',
      );
    }

    validateThresholds(thresholds, activeSteps);
    normalizedThresholds = thresholds;
  }

  // Quantile boundaries: the (k / steps) quantiles of every positive value.
  // Ties stay together because bucketing compares against the boundary value.
  let quantileBoundaries: readonly number[] = [];
  if (resolvedScale === 'quantile') {
    const positives: number[] = [];

    for (const row of data) {
      for (const raw of row) {
        const value = normalizeHeatmapValue(raw);
        if (value !== null && value > 0) {
          positives.push(value);
        }
      }
    }

    if (positives.length > 0) {
      positives.sort((a, b) => a - b);
      quantileBoundaries = Array.from(
        { length: Math.max(activeSteps - 1, 0) },
        (_, index) => {
          // Linear-interpolated quantile at (index + 1) / activeSteps.
          // Positions stay below the last index, so `upper` is always valid.
          const position =
            ((positives.length - 1) * (index + 1)) / activeSteps;
          const lower = Math.floor(position);
          const upper = Math.ceil(position);
          const weight = position - lower;

          return (
            positives[lower] + (positives[upper] - positives[lower]) * weight
          );
        },
      );
    }
  }

  const levelOf = (value: number | null): number => {
    if (value === null || value <= 0) {
      return 0;
    }

    if (resolvedScale === 'thresholds') {
      let level = 1;
      for (const threshold of normalizedThresholds) {
        if (value > threshold) {
          level += 1;
        }
      }
      return Math.min(level, activeSteps);
    }

    if (resolvedScale === 'quantile') {
      let level = 1;
      for (const boundary of quantileBoundaries) {
        if (value > boundary) {
          level += 1;
        }
      }
      return Math.min(level, activeSteps);
    }

    if (resolvedMax <= 0) {
      // Unreachable for positive values: a zero max with positive data is
      // rejected above. Kept as a defensive saturation fallback.
      return activeSteps;
    }

    const step = Math.ceil((value / resolvedMax) * activeSteps);
    return Math.min(Math.max(step, 1), activeSteps);
  };

  return {
    scale: resolvedScale,
    max: resolvedMax,
    levelOf,
  };
}
