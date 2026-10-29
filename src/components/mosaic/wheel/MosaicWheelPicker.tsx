import { View } from 'react-native';

import { MosaicWheelColumn } from './MosaicWheelColumn';
import type { WheelColumn, WheelValue } from './MosaicWheelColumn';
import { clampIndex, normalizeVisibleCount } from './wheelUtils';

export interface MosaicWheelPickerProps {
  /**
   * Current value per column key, e.g. `{ year: 2024, month: 3 }`. Fully
   * controlled: the picker never writes to it and never invents a correction,
   * so a value that no longer exists in its column is clamped for display only.
   */
  value: Record<string, WheelValue>;
  /** Receives the complete next map after one column settles on a new row. */
  onChange: (value: Record<string, WheelValue>) => void;
  columns: WheelColumn[];
  /** Row height in px, shared by every column. */
  itemHeight?: number;
  /** Rows on screen; even values round up to the next odd number. */
  visibleCount?: number;
  /** Light impact each time a column's centred row changes. */
  hapticFeedback?: boolean;
  /** Fade rows away from the centre; set to `false` for a flat list look. */
  fadeEdges?: boolean;
  disabled?: boolean;
  className?: string;
}

/** Index of `value` in a column, falling back to the first item. */
function resolveIndex(items: WheelColumn['items'], value?: WheelValue): number {
  const found = items.findIndex((item) => item.value === value);

  return clampIndex(found < 0 ? 0 : found, items.length);
}

/**
 * Multi-column wheel picker.
 *
 * It knows nothing about dates: columns are plain `{ value, label }` lists, so
 * the same component drives a date wheel, a duration wheel or a height and
 * weight wheel. Date rules (leap years, days per month, precision) belong to
 * the adapter that builds the columns.
 *
 * ```tsx
 * <MosaicWheelPicker
 *   value={{ year, month }}
 *   onChange={(next) => { setYear(Number(next.year)); setMonth(Number(next.month)); }}
 *   columns={[
 *     { key: 'year', label: t('year'), items: years, suffix: t('unit.year') },
 *     { key: 'month', label: t('month'), items: months, suffix: t('unit.month') },
 *   ]}
 * />
 * ```
 */
export function MosaicWheelPicker({
  value,
  onChange,
  columns,
  itemHeight = 40,
  visibleCount = 5,
  hapticFeedback = true,
  fadeEdges = true,
  disabled = false,
  className,
}: MosaicWheelPickerProps) {
  const visibleRows = normalizeVisibleCount(visibleCount);

  return (
    <View
      className={['flex-row items-center', className].filter(Boolean).join(' ')}
    >
      {columns.map((column) => {
        const index = resolveIndex(column.items, value[column.key]);

        return (
          <MosaicWheelColumn
            key={column.key}
            items={column.items}
            selectedIndex={index}
            itemHeight={itemHeight}
            visibleCount={visibleRows}
            suffix={column.suffix}
            width={column.width}
            flex={column.flex}
            loop={column.loop}
            disabled={disabled}
            hapticFeedback={hapticFeedback}
            fadeEdges={fadeEdges}
            accessibilityLabel={column.label ?? column.key}
            onSettle={(next) => {
              const item = column.items[next];

              if (!item || value[column.key] === item.value) {
                return;
              }

              onChange({ ...value, [column.key]: item.value });
            }}
          />
        );
      })}
    </View>
  );
}
