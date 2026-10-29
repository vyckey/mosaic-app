import { View } from 'react-native';
import { Area, CartesianChart, Line, Scatter } from 'victory-native';

import { useTheme } from '@/hooks/use-theme';

import { useChartFont } from './useChartFont';

export interface MoodTrendDatum {
  /** Numeric X position (0-based index). */
  x: number;
  /** `null` leaves a real gap in the line. */
  mood: number | null;
  label: string;
}

export interface MoodTrendChartProps {
  data: readonly MoodTrendDatum[];
  height?: number;
  /** Show every Nth X caption (default 1). */
  labelStride?: number;
  className?: string;
}

/**
 * Mood trend line: 7 daily points (week), 5 weekly samples (month) or 12
 * monthly averages (year). The Y domain is fixed to the 1–5 mood scale so the
 * line height stays comparable across periods.
 */
export function MoodTrendChart({
  data,
  height = 168,
  labelStride = 1,
  className,
}: MoodTrendChartProps) {
  const theme = useTheme();
  const font = useChartFont(10);

  const chartData = data.map((datum) => ({
    x: datum.x,
    mood: datum.mood,
    label: datum.label,
  }));

  // Keep every tick position, but blank the captions that fall between the
  // stride so dense periods (year) do not crowd the axis.
  const shouldShowLabel = (index: number) =>
    labelStride <= 1 || index % labelStride === 0;

  return (
    <View className={className} style={{ height }}>
      <CartesianChart
        data={chartData}
        xKey="x"
        yKeys={['mood']}
        domain={{ y: [1, 5] }}
        domainPadding={{ left: 8, right: 8, top: 8 }}
        axisOptions={{
          font,
          lineColor: theme.colors.borderMuted,
          labelColor: theme.colors.textSubtle,
          tickCount: { x: chartData.length, y: 5 },
          formatXLabel: (value) => {
            const index = Math.round(Number(value));
            return shouldShowLabel(index)
              ? (chartData[index]?.label ?? '')
              : '';
          },
          formatYLabel: (value) => String(Math.round(Number(value))),
        }}
      >
        {({ points, chartBounds }) => (
          <>
            <Area
              points={points.mood}
              y0={chartBounds.bottom}
              color={theme.colors.primary}
              opacity={0.12}
            />
            <Line
              points={points.mood}
              color={theme.colors.primary}
              strokeWidth={2}
              curveType="natural"
            />
            <Scatter
              points={points.mood}
              radius={3}
              color={theme.colors.primary}
            />
          </>
        )}
      </CartesianChart>
    </View>
  );
}
