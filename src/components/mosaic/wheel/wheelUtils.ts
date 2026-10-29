/**
 * Pure helpers behind the wheel pickers. They are intentionally free of React
 * and of the wheel's own types so they can be unit tested without rendering:
 * every geometry decision (padding, centred row, clamping) lives here.
 */

/** A wheel needs one row on each side of the centred one to read as a wheel. */
const MIN_VISIBLE_COUNT = 3;

/** Fallback row count used when a caller passes a non-finite value. */
const DEFAULT_VISIBLE_COUNT = 5;

/**
 * Snaps `visibleCount` to a usable value: at least three rows and always odd,
 * because an even count has no centred row. Even input rounds up (4 → 5)
 * rather than down, so a caller asking for more rows never gets fewer.
 */
export function normalizeVisibleCount(count: number): number {
  if (!Number.isFinite(count)) {
    return DEFAULT_VISIBLE_COUNT;
  }

  const whole = Math.max(MIN_VISIBLE_COUNT, Math.floor(count));

  return whole % 2 === 0 ? whole + 1 : whole;
}

/** Clamps an index into `[0, count - 1]`; an empty list always yields 0. */
export function clampIndex(index: number, count: number): number {
  if (count <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), count - 1);
}

/**
 * Scroll offset that centres `visibleCount` rows around one item: the empty
 * space above the first row and below the last one.
 */
export function wheelPadding(itemHeight: number, visibleCount: number): number {
  return ((normalizeVisibleCount(visibleCount) - 1) / 2) * itemHeight;
}

/**
 * Index of the row closest to a scroll offset. Offsets are rounded because a
 * wheel always settles between rows, and clamped because iOS reports offsets
 * outside the content bounds while bouncing (and while rows are being removed).
 */
export function nearestIndex(
  offsetY: number,
  itemHeight: number,
  count: number,
): number {
  if (!(itemHeight > 0) || !Number.isFinite(offsetY)) {
    return 0;
  }

  return clampIndex(Math.round(offsetY / itemHeight), count);
}
