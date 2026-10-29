import {
  buildDateTimeModel,
  composeDateTime,
  daysInMonth,
  normalizeMinuteInterval,
  snapMinute,
  type BuildDateTimeModelOptions,
} from '../datetime/dateTimeModel';

const monthNames = [
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

const dayPeriods = { am: 'AM', pm: 'PM' };

function model(
  values: Omit<BuildDateTimeModelOptions, 'monthNames' | 'dayPeriods'>,
) {
  return buildDateTimeModel({
    monthNames,
    dayPeriods,
    ...values,
  });
}

describe('daysInMonth', () => {
  it('handles leap years', () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2023, 2)).toBe(28);
    expect(daysInMonth(2024, 4)).toBe(30);
    expect(daysInMonth(2024, 12)).toBe(31);
  });
});

describe('minute grid', () => {
  it('rounds intervals to a usable divisor', () => {
    expect(normalizeMinuteInterval(1)).toBe(1);
    expect(normalizeMinuteInterval(7)).toBe(6);
    expect(normalizeMinuteInterval(45)).toBe(30);
    expect(normalizeMinuteInterval(Number.NaN)).toBe(1);
  });

  it('snaps minutes without leaving 0–59', () => {
    expect(snapMinute(37, 5)).toBe(35);
    expect(snapMinute(38, 5)).toBe(40);
    expect(snapMinute(58, 30)).toBe(30);
  });
});

describe('composeDateTime', () => {
  it('pulls an impossible day back to the end of the month', () => {
    const base = new Date(2024, 0, 31, 10, 30);
    const next = composeDateTime({ base, patch: { month: 2 } });

    expect(next.getFullYear()).toBe(2024);
    expect(next.getMonth()).toBe(1);
    expect(next.getDate()).toBe(29);
    // The time part is never rewritten by a date change.
    expect(next.getHours()).toBe(10);
    expect(next.getMinutes()).toBe(30);
  });

  it('does the same in a non-leap year', () => {
    const next = composeDateTime({
      base: new Date(2023, 0, 31, 10, 30),
      patch: { month: 2 },
    });

    expect(next.getDate()).toBe(28);
  });

  it('clamps the day into [minimumDate, maximumDate]', () => {
    const belowMin = composeDateTime({
      base: new Date(2020, 0, 1, 9, 0),
      patch: { year: 2019 },
      minimumDate: new Date(2020, 5, 15),
    });
    expect(belowMin.getFullYear()).toBe(2020);
    expect(belowMin.getMonth()).toBe(5);
    expect(belowMin.getDate()).toBe(15);

    const aboveMax = composeDateTime({
      base: new Date(2026, 10, 5, 9, 0),
      patch: { year: 2030 },
      maximumDate: new Date(2026, 10, 1),
    });
    expect(aboveMax.getFullYear()).toBe(2026);
    expect(aboveMax.getMonth()).toBe(10);
    expect(aboveMax.getDate()).toBe(1);
    expect(aboveMax.getHours()).toBe(9);
  });

  it('snaps the minute only when the clock is shown', () => {
    const dateOnly = composeDateTime({
      base: new Date(2024, 5, 1, 10, 37),
      mode: 'date',
      minuteInterval: 5,
    });
    expect(dateOnly.getMinutes()).toBe(37);

    const withTime = composeDateTime({
      base: new Date(2024, 5, 1, 10, 37),
      mode: 'datetime',
      minuteInterval: 5,
    });
    expect(withTime.getMinutes()).toBe(35);
  });
});

describe('buildDateTimeModel', () => {
  it('shows the wheels of the requested mode', () => {
    const value = new Date(2024, 5, 12, 9, 5);

    expect(model({ value, mode: 'date' }).columns.map((c) => c.key)).toEqual([
      'year',
      'month',
      'day',
    ]);
    expect(model({ value, mode: 'time' }).columns.map((c) => c.key)).toEqual([
      'hour',
      'minute',
    ]);
    expect(
      model({ value, mode: 'datetime', hourCycle: '24h' }).columns.map(
        (c) => c.key,
      ),
    ).toEqual(['year', 'month', 'day', 'hour', 'minute']);
    expect(
      model({ value, mode: 'time', hourCycle: '12h' }).columns.map((c) => c.key),
    ).toEqual(['hour', 'minute', 'period']);
  });

  it('rebuilds the day wheel for the selected month', () => {
    const february = model({ value: new Date(2024, 1, 10), mode: 'date' });
    const dayColumn = february.columns.find((column) => column.key === 'day');

    expect(dayColumn?.items).toHaveLength(29);
    expect(february.values.day).toBe(10);
  });

  it('narrows the month and day wheels to the bounds', () => {
    const built = model({
      value: new Date(2018, 0, 1),
      mode: 'date',
      minimumDate: new Date(2020, 5, 15),
    });

    const yearColumn = built.columns.find((column) => column.key === 'year');
    const monthColumn = built.columns.find((column) => column.key === 'month');
    const dayColumn = built.columns.find((column) => column.key === 'day');

    // The value is clamped forward to the earliest allowed day first.
    expect(built.date.getFullYear()).toBe(2020);
    expect(built.date.getMonth()).toBe(5);
    expect(built.date.getDate()).toBe(15);

    expect(yearColumn?.items[0].value).toBe(2020);
    expect(monthColumn?.items[0].value).toBe(6);
    expect(dayColumn?.items[0].value).toBe(15);
  });

  it('maps the hour onto a 12-hour clock', () => {
    const midnight = model({
      value: new Date(2024, 5, 1, 0, 20),
      mode: 'time',
      hourCycle: '12h',
    });
    expect(midnight.values.hour).toBe(12);
    expect(midnight.values.period).toBe('am');

    const afternoon = model({
      value: new Date(2024, 5, 1, 13, 20),
      mode: 'time',
      hourCycle: '12h',
    });
    expect(afternoon.values.hour).toBe(1);
    expect(afternoon.values.period).toBe('pm');
  });

  it('reports minutes on the grid', () => {
    const built = model({
      value: new Date(2024, 5, 1, 10, 37),
      mode: 'time',
      minuteInterval: 5,
    });

    expect(built.values.minute).toBe(35);
    expect(
      built.columns.find((column) => column.key === 'minute')?.items,
    ).toHaveLength(12);
  });
});
