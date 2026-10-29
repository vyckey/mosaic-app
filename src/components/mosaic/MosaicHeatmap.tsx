import { useEffect, useRef } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n/useI18n';

import {
  createHeatmapLevelResolver,
  normalizeHeatmapValue,
  type MosaicHeatmapScale,
  type MosaicHeatmapValue,
} from './heatmap-scale';

export type {
  MosaicHeatmapScale,
  MosaicHeatmapValue,
} from './heatmap-scale';

export interface MosaicHeatmapCell {
  rowIndex: number;
  columnIndex: number;
  /** Resolved row label, e.g. `W1`. */
  rowLabel?: string;
  /** Resolved column label, e.g. `Mon` or `1`. */
  columnLabel?: string;
  /** Normalized value; `null` for out-of-range slots. */
  value: number | null;
  /** Index into the color ramp; `0` means "no activity". */
  level: number;
}

export interface MosaicHeatmapSelection {
  rowIndex: number;
  columnIndex: number;
}

export interface MosaicHeatmapProps {
  /** Row-major values, top row first. Rows may be shorter than `columnLabels`. */
  data: readonly (readonly MosaicHeatmapValue[])[];
  /** Labels above the grid (e.g. Mon..Sun, 1..12). */
  columnLabels?: readonly (string | number)[];
  /** Labels left of the grid (e.g. W1..W5). */
  rowLabels?: readonly (string | number)[];
  /**
   * Color ramp from "no activity" to "most active" (at least 2 colors). Its
   * length decides how many intensity steps are available. Defaults to the
   * theme's 5-step sage ramp.
   */
  colors?: readonly string[];
  /** Upper bound for `linear` bucketing; defaults to the largest value in `data`. */
  max?: number;
  /**
   * Bucketing strategy. Defaults to `'thresholds'` when `thresholds` is
   * provided, otherwise `'linear'`.
   */
  scale?: MosaicHeatmapScale;
  /**
   * Strictly increasing upper bounds used by `scale="thresholds"`. Needs
   * exactly `colors.length - 2` entries so every activity level is reachable.
   */
  thresholds?: readonly number[];
  /** Corner radius of each cell (default 4). */
  cellRadius?: number;
  /** Gap between cells and rows (default 4). */
  cellGap?: number;
  /** Width of the row label gutter (default 28). */
  rowLabelWidth?: number;
  /**
   * Fixed cell edge length. When omitted, cells stretch to fill the available
   * width. When provided, the grid scrolls horizontally if it overflows.
   */
  cellSize?: number;
  /** Show the "Less → More" scale below the grid. */
  showLegend?: boolean;
  /** Whether to show column labels (default true). */
  showColumnLabels?: boolean;
  /** Whether to show row labels (default true). */
  showRowLabels?: boolean;
  /** Controlled selection highlight. */
  selectedCell?: MosaicHeatmapSelection;
  /** Override the localized legend captions. */
  lessLabel?: string;
  moreLabel?: string;
  /** Makes in-range cells pressable and reports the tapped cell. */
  onCellPress?: (cell: MosaicHeatmapCell) => void;
  /** Builds the screen-reader label for a pressable cell. */
  accessibilityLabel?: (cell: MosaicHeatmapCell) => string;
  /** Screen-reader hint for pressable cells. */
  accessibilityHint?: string;
  className?: string;
}

/**
 * Generic activity heatmap.
 *
 * One component covers every dimension of the Statistics screen:
 * - Month: 4–6 rows (W1..W6) × 7 columns (Mon..Sun), out-of-month days `null`
 * - Year:  5 rows (W1..W5) × 12 columns (Jan..Dec)
 *
 * ```tsx
 * <MosaicHeatmap
 *   rowLabels={['W1', 'W2', 'W3', 'W4', 'W5']}
 *   columnLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
 *   data={[[null, null, null, null, null, 1, 2], ...]}
 *   showLegend
 * />
 * ```
 */
export function MosaicHeatmap({
  data,
  columnLabels,
  rowLabels,
  colors,
  max,
  scale,
  thresholds,
  cellRadius = 4,
  cellGap = 4,
  rowLabelWidth = 28,
  cellSize,
  showLegend = false,
  showColumnLabels = true,
  showRowLabels = true,
  selectedCell,
  lessLabel,
  moreLabel,
  onCellPress,
  accessibilityLabel,
  accessibilityHint,
  className,
}: MosaicHeatmapProps) {
  const theme = useTheme();
  const { t } = useI18n();

  const defaultRamp: readonly string[] = [
    theme.colors.backgroundMuted, // no activity
    theme.colors.primaryMuted,
    theme.colors.primarySoft,
    theme.colors.primary,
    theme.colors.primaryStrong,
  ];

  const hasValidColors = colors === undefined || colors.length >= 2;
  const ramp: readonly string[] =
    colors !== undefined && colors.length >= 2 ? colors : defaultRamp;

  // Keep every row aligned even when callers pass ragged arrays.
  const columnCount = Math.max(
    columnLabels?.length ?? 0,
    ...data.map((row) => row.length),
    0,
  );

  // `ramp[0]` is the empty shade; the remaining entries are activity steps.
  const activeSteps = Math.max(ramp.length - 1, 1);

  // Throws on invalid `max` / `thresholds` combinations.
  const levelResolver = createHeatmapLevelResolver({
    data,
    steps: activeSteps,
    max,
    scale,
    thresholds,
  });

  // Invalid ramps fall back to the theme; warn once per mounted instance.
  const hasWarnedInvalidColors = useRef(false);
  useEffect(() => {
    if (
      __DEV__ &&
      colors !== undefined &&
      !hasValidColors &&
      !hasWarnedInvalidColors.current
    ) {
      hasWarnedInvalidColors.current = true;
      console.warn(
        '[MosaicHeatmap] `colors` needs at least 2 entries; using the default theme ramp instead.',
      );
    }
  }, [colors, hasValidColors]);

  // `max` is linear-only; make the ignored prop visible during development.
  const hasIgnoredMax = max !== undefined && levelResolver.scale !== 'linear';
  const hasWarnedIgnoredMax = useRef(false);
  useEffect(() => {
    if (__DEV__ && hasIgnoredMax && !hasWarnedIgnoredMax.current) {
      hasWarnedIgnoredMax.current = true;
      console.warn(
        '[MosaicHeatmap] `max` only applies to scale="linear" and was ignored.',
      );
    }
  }, [hasIgnoredMax]);

  const fixedCellSize =
    typeof cellSize === 'number' &&
    Number.isFinite(cellSize) &&
    cellSize > 0
      ? cellSize
      : undefined;

  // Cells are square: either fixed-size, or stretched to share the row width.
  const cellDimensionStyle: ViewStyle = fixedCellSize
    ? { width: fixedCellSize, height: fixedCellSize }
    : { flex: 1, aspectRatio: 1 };

  const showColumnLabelRow =
    showColumnLabels && columnLabels !== undefined && columnCount > 0;
  const showRowLabelColumn = showRowLabels && rowLabels !== undefined;

  // Explicit content width so a horizontal ScrollView never collapses the grid.
  const gridContentWidth = fixedCellSize
    ? (showRowLabelColumn ? rowLabelWidth + cellGap : 0) +
      columnCount * fixedCellSize +
      Math.max(columnCount - 1, 0) * cellGap
    : undefined;

  // A pressed cell fades slightly. Keep the touch area inside `cellGap` so
  // neighbouring cells never overlap.
  const cellHitSlop = cellGap >= 4 ? 2 : 0;

  const buildAccessibilityLabel = (cell: MosaicHeatmapCell) => {
    if (accessibilityLabel) {
      return accessibilityLabel(cell);
    }

    return [cell.rowLabel, cell.columnLabel, cell.value]
      .filter((part) => part !== undefined && part !== null)
      .join(', ');
  };

  const renderCells = (rowIndex: number) => {
    const row = data[rowIndex] ?? [];

    return Array.from({ length: columnCount }, (_, columnIndex) => {
      const value = normalizeHeatmapValue(row[columnIndex]);
      const level = levelResolver.levelOf(value);
      const isSelected =
        value !== null &&
        selectedCell?.rowIndex === rowIndex &&
        selectedCell?.columnIndex === columnIndex;

      const cellStyle: ViewStyle = {
        ...cellDimensionStyle,
        borderRadius: cellRadius,
        // Out-of-range slots stay transparent but still occupy their column.
        backgroundColor: value === null ? 'transparent' : ramp[level],
        ...(isSelected
          ? { borderWidth: 2, borderColor: theme.colors.primaryStrong }
          : null),
      };

      if (!onCellPress || value === null) {
        return <View key={columnIndex} style={cellStyle} />;
      }

      const cell: MosaicHeatmapCell = {
        rowIndex,
        columnIndex,
        rowLabel: rowLabels?.[rowIndex]?.toString(),
        columnLabel: columnLabels?.[columnIndex]?.toString(),
        value,
        level,
      };

      return (
        <Pressable
          key={columnIndex}
          className="active:opacity-70"
          style={cellStyle}
          hitSlop={cellHitSlop}
          accessibilityRole="button"
          accessibilityLabel={buildAccessibilityLabel(cell)}
          accessibilityHint={accessibilityHint}
          accessibilityState={{ selected: isSelected }}
          onPress={() => onCellPress(cell)}
        />
      );
    });
  };

  const grid = (
    <View style={{ gap: cellGap }}>
      {showColumnLabelRow && (
        <View
          style={{ flexDirection: 'row', alignItems: 'center', gap: cellGap }}
        >
          {showRowLabelColumn && <View style={{ width: rowLabelWidth }} />}

          {Array.from({ length: columnCount }, (_, columnIndex) => (
            <View
              key={columnIndex}
              style={[
                { alignItems: 'center' },
                fixedCellSize ? { width: fixedCellSize } : { flex: 1 },
              ]}
            >
              <Text
                className="text-micro leading-none text-text-subtle"
                numberOfLines={1}
              >
                {columnLabels?.[columnIndex] ?? ''}
              </Text>
            </View>
          ))}
        </View>
      )}

      {data.map((_, rowIndex) => (
        <View
          key={rowIndex}
          style={{ flexDirection: 'row', alignItems: 'center', gap: cellGap }}
        >
          {showRowLabelColumn && (
            <Text
              className="text-micro leading-none text-text-subtle"
              style={{ width: rowLabelWidth, flexShrink: 0 }}
              numberOfLines={1}
            >
              {rowLabels?.[rowIndex] ?? ''}
            </Text>
          )}

          {renderCells(rowIndex)}
        </View>
      ))}
    </View>
  );

  return (
    <View
      className={['w-full', className].filter(Boolean).join(' ')}
      style={{ gap: cellGap }}
    >
      {fixedCellSize ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ minWidth: '100%' }}
        >
          <View style={{ width: gridContentWidth }}>{grid}</View>
        </ScrollView>
      ) : (
        grid
      )}

      {showLegend && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text className="mr-1 text-micro leading-none text-text-subtle">
            {lessLabel ?? t('heatmap.less')}
          </Text>

          {ramp.map((color, index) => (
            <View
              key={index}
              style={{
                width: 12,
                height: 12,
                borderRadius: cellRadius,
                backgroundColor: color,
              }}
            />
          ))}

          <Text className="ml-1 text-micro leading-none text-text-subtle">
            {moreLabel ?? t('heatmap.more')}
          </Text>
        </View>
      )}
    </View>
  );
}
