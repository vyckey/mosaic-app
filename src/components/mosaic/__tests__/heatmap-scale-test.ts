import {
  createHeatmapLevelResolver,
  normalizeHeatmapValue,
  type CreateHeatmapLevelResolverOptions,
} from '../heatmap-scale';

const STEPS = 4; // 5-color ramp

const levelsOf = (
  data: readonly (readonly (number | null | undefined)[])[],
  options: Partial<Omit<CreateHeatmapLevelResolverOptions, 'data' | 'steps'>> = {},
) => {
  const resolver = createHeatmapLevelResolver({
    data,
    steps: STEPS,
    ...options,
  });

  return data.map((row) =>
    row.map((raw) => {
      const value = normalizeHeatmapValue(raw);
      return value === null ? null : resolver.levelOf(value);
    }),
  );
};

describe('normalizeHeatmapValue', () => {
  it('keeps finite non-negative numbers', () => {
    expect(normalizeHeatmapValue(0)).toBe(0);
    expect(normalizeHeatmapValue(7)).toBe(7);
  });

  it('treats missing and non-finite values as out-of-range', () => {
    expect(normalizeHeatmapValue(null)).toBeNull();
    expect(normalizeHeatmapValue(undefined)).toBeNull();
    expect(normalizeHeatmapValue(Number.NaN)).toBeNull();
    expect(normalizeHeatmapValue(Number.POSITIVE_INFINITY)).toBeNull();
  });

  it('clamps negatives to "no activity"', () => {
    expect(normalizeHeatmapValue(-3)).toBe(0);
  });
});

describe('linear scale', () => {
  it('maps zeros to level 0', () => {
    expect(levelsOf([[0, 0, 0]])).toEqual([[0, 0, 0]]);
  });

  it('stretches values evenly up to the data maximum', () => {
    expect(levelsOf([[1, 2, 3, 4]])).toEqual([[1, 2, 3, 4]]);
  });

  it('saturates values above an explicit max', () => {
    expect(levelsOf([[5, 10]], { max: 4 })).toEqual([[4, 4]]);
  });

  it('allows max = 0 when there are no positive values', () => {
    expect(() =>
      createHeatmapLevelResolver({
        data: [[0, null]],
        steps: STEPS,
        max: 0,
      }),
    ).not.toThrow();
  });

  it('rejects max = 0 when the data contains positive values', () => {
    expect(() =>
      createHeatmapLevelResolver({ data: [[1]], steps: STEPS, max: 0 }),
    ).toThrow(/greater than 0/);
  });

  it('rejects invalid max values', () => {
    expect(() =>
      createHeatmapLevelResolver({ data: [[1]], steps: STEPS, max: -1 }),
    ).toThrow(/finite non-negative/);
    expect(() =>
      createHeatmapLevelResolver({
        data: [[1]],
        steps: STEPS,
        max: Number.NaN,
      }),
    ).toThrow(/finite non-negative/);
    expect(() =>
      createHeatmapLevelResolver({
        data: [[1]],
        steps: STEPS,
        max: Number.POSITIVE_INFINITY,
      }),
    ).toThrow(/finite non-negative/);
  });
});

describe('threshold scale', () => {
  it('uses thresholds as upper bounds and keeps boundary values in the lower level', () => {
    const resolver = createHeatmapLevelResolver({
      data: [[1]],
      steps: STEPS,
      scale: 'thresholds',
      thresholds: [2, 5, 10],
    });

    expect(
      [0, 1, 2, 3, 5, 6, 10, 11].map((value) => resolver.levelOf(value)),
    ).toEqual([0, 1, 1, 2, 2, 3, 3, 4]);
  });

  it('enables the threshold scale automatically when thresholds are provided', () => {
    const resolver = createHeatmapLevelResolver({
      data: [[1]],
      steps: STEPS,
      thresholds: [2, 5, 10],
    });

    expect(resolver.scale).toBe('thresholds');
  });

  it('requires exactly steps - 1 thresholds', () => {
    expect(() =>
      createHeatmapLevelResolver({
        data: [[1]],
        steps: STEPS,
        scale: 'thresholds',
        thresholds: [2, 5],
      }),
    ).toThrow(/exactly 3 entries/);
  });

  it('requires finite, non-negative, strictly increasing thresholds', () => {
    const create = (thresholds: readonly number[]) =>
      createHeatmapLevelResolver({
        data: [[1]],
        steps: STEPS,
        scale: 'thresholds',
        thresholds,
      });

    expect(() => create([-1, 5, 10])).toThrow(/non-negative/);
    expect(() => create([2, Number.NaN, 10])).toThrow(/non-negative/);
    expect(() => create([2, 2, 10])).toThrow(/strictly increasing/);
    expect(() => create([5, 10, 2])).toThrow(/strictly increasing/);
  });
});

describe('quantile scale', () => {
  it('uses every positive data point so duplicates keep the same level', () => {
    const data = [[1, 1, 1, 1, 1, 2, 3, 4, 100]];
    const levels = levelsOf(data, { scale: 'quantile' })[0];

    // All five 1s share a level, and repeated values never split.
    expect(new Set(levels.slice(0, 5))).toEqual(new Set([levels[0]]));
    // The frequent low value no longer gets the same weight as the lone max.
    expect(levels[0]).toBe(1);
    expect(levels[5]!).toBeGreaterThan(levels[0]!); // 2
    expect(levels[8]).toBe(STEPS); // 100
  });

  it('puts a single positive value on the first activity level', () => {
    expect(levelsOf([[7]], { scale: 'quantile' })).toEqual([[1]]);
  });

  it('ignores max', () => {
    const resolver = createHeatmapLevelResolver({
      data: [[1, 2, 10]],
      steps: STEPS,
      scale: 'quantile',
      max: 1000,
    });

    expect(resolver.max).toBe(10);
    expect(resolver.levelOf(1)).toBe(1);
    expect(resolver.levelOf(10)).toBe(STEPS);
  });
});

describe('edge cases', () => {
  it('keeps out-of-range slots as null', () => {
    expect(
      levelsOf([
        [null, undefined, Number.NaN, Number.POSITIVE_INFINITY],
      ]),
    ).toEqual([[null, null, null, null]]);
  });

  it('keeps levels inside 0..steps', () => {
    const resolver = createHeatmapLevelResolver({
      data: [[1, 100]],
      steps: 3,
      scale: 'linear',
    });

    expect(resolver.levelOf(0)).toBe(0);
    expect(resolver.levelOf(1)).toBeGreaterThanOrEqual(1);
    expect(resolver.levelOf(100)).toBeLessThanOrEqual(3);
  });

  it('treats fewer than one step as a single activity level', () => {
    const resolver = createHeatmapLevelResolver({ data: [[5]], steps: 0 });
    expect(resolver.levelOf(5)).toBe(1);
  });
});
