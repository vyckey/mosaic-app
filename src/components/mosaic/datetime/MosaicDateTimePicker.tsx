import { useMemo } from 'react';

import { useI18n } from '@/i18n/useI18n';

import type { WheelValue } from '../wheel/MosaicWheelColumn';
import { MosaicWheelPicker } from '../wheel/MosaicWheelPicker';
import {
  buildDateTimeModel,
  composeDateTime,
  type DateTimeMode,
  type DateTimeParts,
  type HourCycle,
} from './dateTimeModel';

export type { DateTimeMode, HourCycle } from './dateTimeModel';

export interface MosaicDateTimePickerProps {
  /** Which wheels to show. Defaults to `datetime`. */
  mode?: DateTimeMode;
  /** Selected instant. Fully controlled. */
  value: Date;
  /** Receives a calendar-valid, in-range date after every wheel settles. */
  onChange: (value: Date) => void;
  /** Earliest selectable day (the time part is ignored). */
  minimumDate?: Date;
  /** Latest selectable day (the time part is ignored). */
  maximumDate?: Date;
  /** Step of the minutes wheel; rounds to a usable divisor of 60. */
  minuteInterval?: number;
  /** 12- or 24-hour clock; defaults to the UI locale. */
  hourCycle?: HourCycle;
  /** Row height in px. */
  itemHeight?: number;
  /** Rows on screen; even values round up to the next odd number. */
  visibleCount?: number;
  hapticFeedback?: boolean;
  fadeEdges?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Date / time wheel built on `MosaicWheelPicker`.
 *
 * It owns the calendar rules — days per month, leap years, ranges, minute
 * steps — and nothing else: presentation (sheet, confirm button, title) stays
 * with the screen. Months and days are rebuilt from the current selection, so
 * impossible dates are never offered (31 January → selecting February lands on
 * the 29th in a leap year, not on 2 March).
 *
 * ```tsx
 * <MosaicDateTimePicker
 *   mode="date"
 *   value={birthday}
 *   maximumDate={new Date()}
 *   onChange={setBirthday}
 * />
 * ```
 */
export function MosaicDateTimePicker({
  mode = 'datetime',
  value,
  onChange,
  minimumDate,
  maximumDate,
  minuteInterval = 1,
  hourCycle,
  itemHeight,
  visibleCount,
  hapticFeedback,
  fadeEdges,
  disabled,
  className,
}: MosaicDateTimePickerProps) {
  const { locale, t } = useI18n();

  // No explicit per-user clock preference yet: Chinese reads 24-hour, the
  // English UI defaults to 12-hour. `hourCycle` overrides both.
  const resolvedHourCycle: HourCycle =
    hourCycle ?? (locale.startsWith('zh') ? '24h' : '12h');

  const localization = useMemo(
    () => ({
      monthNames: Array.from({ length: 12 }, (_, index) =>
        t(`common.months.${index}`),
      ),
      dayPeriods: { am: t('common.am'), pm: t('common.pm') },
      units: {
        year: t('common.units.year'),
        day: t('common.units.day'),
        hour: t('common.units.hour'),
        minute: t('common.units.minute'),
      },
      labels: {
        year: t('dateTime.year'),
        month: t('dateTime.month'),
        day: t('dateTime.day'),
        hour: t('dateTime.hour'),
        minute: t('dateTime.minute'),
        period: t('dateTime.period'),
      },
    }),
    // `t` reads `i18n.locale` directly, so the memo must re-run when it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale, t],
  );

  const model = useMemo(
    () =>
      buildDateTimeModel({
        value,
        mode,
        hourCycle: resolvedHourCycle,
        minuteInterval,
        minimumDate,
        maximumDate,
        ...localization,
      }),
    [
      value,
      mode,
      resolvedHourCycle,
      minuteInterval,
      minimumDate,
      maximumDate,
      localization,
    ],
  );

  const handleChange = (next: Record<string, WheelValue>) => {
    const patch: Partial<DateTimeParts> = {};

    if (next.year !== undefined) {
      patch.year = Number(next.year);
    }
    if (next.month !== undefined) {
      patch.month = Number(next.month);
    }
    if (next.day !== undefined) {
      patch.day = Number(next.day);
    }
    if (next.minute !== undefined) {
      patch.minute = Number(next.minute);
    }

    if (mode !== 'date') {
      const currentHour = model.date.getHours();

      if (resolvedHourCycle === '12h') {
        const hour12 =
          next.hour === undefined ? ((currentHour + 11) % 12) + 1 : Number(next.hour);
        const period =
          next.period === 'am' || next.period === 'pm'
            ? next.period
            : currentHour < 12
              ? 'am'
              : 'pm';

        patch.hour = (hour12 % 12) + (period === 'pm' ? 12 : 0);
      } else if (next.hour !== undefined) {
        patch.hour = Number(next.hour);
      }
    }

    onChange(
      composeDateTime({
        base: model.date,
        patch,
        mode,
        minuteInterval,
        minimumDate,
        maximumDate,
      }),
    );
  };

  return (
    <MosaicWheelPicker
      value={model.values}
      onChange={handleChange}
      columns={model.columns}
      itemHeight={itemHeight}
      visibleCount={visibleCount}
      hapticFeedback={hapticFeedback}
      fadeEdges={fadeEdges}
      disabled={disabled}
      className={className}
    />
  );
}
