import { View } from 'react-native';
import { Bar, CartesianChart } from 'victory-native';

import { useTheme } from '@/hooks/use-theme';

import { useChartFont } from './useChartFont';

export interface RecordsBarDatum {
  /** Numeric X position (0-based index). */
  x: number;
  records: number;
  label: string;
}

export interface RecordsBarChartProps {
  data: readonly RecordsBarDatum[];
  height?: number;
  className?: string;
}

/**
 * Week view: one bar per weekday.
 *
 * Victory Native XL owns the axes, grid and bar geometry; the component only
 * maps the already-aggregated daily counts into its datum shape.
 */
export function RecordsBarChart({
  data,
  height = 176,
  className,
}: RecordsBarChartProps) {
  const theme = useTheme();
  const font = useChartFont(10);

  const chartData = data.map((datum) => ({
    x: datum.x,
    records: datum.records,
    label: datum.label,
  }));

  const max = Math.max(...chartData.map((datum) => datum.records), 1);
  const yMax = Math.max(Math.ceil(max / 2) * 2, 2);

  return (
    <View className={className} style={{ height }}>
      <CartesianChart
        data={chartData}
        xKey="x"
        yKeys={['records']}
        domain={{ y: [0, yMax] }}
        domainPadding={{ left: 10, right: 10, top: 10 }}
        axisOptions={{
          font,
          lineColor: theme.colors.borderMuted,
          labelColor: theme.colors.textSubtle,
          tickCount: { x: chartData.length, y: 5 },
          formatXLabel: (value) =>
            chartData[Math.round(Number(value))]?.label ?? '',
          formatYLabel: (value) => String(Math.round(Number(value))),
        }}
      >
        {({ points, chartBounds }) => (
          <Bar
            points={points.records}
            chartBounds={chartBounds}
            color={theme.colors.primarySoft}
            innerPadding={0.35}
            roundedCorners={{ topLeft: 4, topRight: 4 }}
          />
        )}
      </CartesianChart>
    </View>
  );
}
