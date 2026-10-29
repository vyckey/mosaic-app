import { addDays, dayKey, startOfDay } from './period';
import type { DailyActivity, RecordTypeKey } from './types';

/**
 * Deterministic 32-bit hash. The mock is stable across renders / reloads so
 * navigating between periods never reshuffles the same day's numbers.
 */
function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

/** Small deterministic PRNG (mulberry32). */
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** Weighted record type for one entry. */
function pickType(random: () => number): RecordTypeKey {
  const roll = random();
  if (roll < 0.4) return 'text';
  if (roll < 0.7) return 'photo';
  if (roll < 0.9) return 'diary';
  return 'others';
}

function createDay(date: Date, today: Date): DailyActivity {
  const random = createRandom(hash(dayKey(date)));
  const isFuture = startOfDay(date) > today;
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  // A realistic mix: quiet weekdays, busier weekends, the occasional empty day.
  const records = isFuture
    ? 0
    : random() < 0.12
      ? 0
      : Math.round(1 + random() * 5 + (isWeekend ? 2 : 0));

  const types: Record<RecordTypeKey, number> = {
    text: 0,
    photo: 0,
    diary: 0,
    others: 0,
  };

  for (let index = 0; index < records; index += 1) {
    types[pickType(random)] += 1;
  }

  const hasMood = records > 0 && random() < 0.55;
  const moodEntries = hasMood ? (random() < 0.2 ? 2 : 1) : 0;
  const mood = hasMood ? Math.round((1 + random() * 4) * 10) / 10 : null;

  return {
    date,
    records,
    mood,
    moodEntries,
    photos: types.photo,
    words: records === 0 ? 0 : records * (20 + Math.floor(random() * 80)),
    types,
  };
}

/**
 * Builds a deterministic daily activity set spanning three years: two years
 * back, the current year, and the following year (future days stay empty).
 *
 * This is the prototype data source. A real implementation only needs to
 * replace this function with a storage query that returns `DailyActivity[]`.
 */
export function createMockDailyActivity(reference: Date = new Date()): DailyActivity[] {
  const today = startOfDay(reference);
  const start = new Date(today.getFullYear() - 2, 0, 1);
  const end = new Date(today.getFullYear() + 1, 0, 1);

  const days: DailyActivity[] = [];
  let cursor = start;

  while (cursor < end) {
    days.push(createDay(cursor, today));
    cursor = addDays(cursor, 1);
  }

  return days;
}

/** Shared instance so navigating the screen does not regenerate the mock. */
export const mockDailyActivity = createMockDailyActivity();
