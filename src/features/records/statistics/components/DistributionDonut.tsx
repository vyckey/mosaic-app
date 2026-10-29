import { View } from 'react-native';
import { Pie, PolarChart } from 'victory-native';

import { MosaicText } from '@/components/mosaic';
import { useTheme } from '@/hooks/use-theme';

export interface DistributionDonutDatum {
  key: string;
  label: string;
  value: number;
  color?: string;
}

export interface DistributionDonutProps {
  data: readonly DistributionDonutDatum[];
  /** Outer diameter in px (default 112). */
  size?: number;
  /** Ring thickness in px (default 18). */
  thickness?: number;
  showLegend?: boolean;
  className?: string;
}

/**
 * Donut + legend for the mood and record-type distributions.
 *
 * Victory Native XL's `PolarChart` / `Pie.Chart` paints the ring; percentages
 * are derived here from the aggregated values. A zero total falls back to a
 * plain track so the layout does not collapse in an empty period.
 */
export function DistributionDonut({
  data,
  size = 112,
  thickness = 18,
  showLegend = true,
  className,
}: DistributionDonutProps) {
  const theme = useTheme();

  const fallbackColors = [
    theme.colors.primary,
    theme.colors.accentLav,
    theme.colors.accentClay,
    theme.colors.info,
    theme.colors.warning,
  ];

  const total = data.reduce((sum, datum) => sum + Math.max(datum.value, 0), 0);
  const chartData = data.map((datum, index) => ({
    key: datum.key,
    label: datum.label,
    value: Math.max(datum.value, 0),
    color: datum.color ?? fallbackColors[index % fallbackColors.length],
  }));

  return (
    <View
      className={['flex-row items-center gap-4', className]
        .filter(Boolean)
        .join(' ')}
    >
      <View style={{ width: size, height: size }}>
        {total > 0 ? (
          <PolarChart
            data={chartData}
            colorKey="color"
            labelKey="label"
            valueKey="value"
            explicitSize={{ width: size, height: size }}
          >
            <Pie.Chart innerRadius="66%" startAngle={-90}>
              {() => <Pie.Slice />}
            </Pie.Chart>
          </PolarChart>
        ) : (
          <View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: thickness,
              borderColor: theme.colors.borderMuted,
            }}
          />
        )}
      </View>

      {showLegend && (
        <View className="flex-1 gap-2">
          {data.map((datum, index) => {
            const percent =
              total > 0
                ? Math.round((Math.max(datum.value, 0) / total) * 100)
                : 0;

            return (
              <View key={datum.key} className="flex-row items-center gap-2">
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor:
                      datum.color ??
                      fallbackColors[index % fallbackColors.length],
                  }}
                />
                <MosaicText
                  variant="caption"
                  tone="text-muted"
                  className="flex-1"
                  truncated
                >
                  {datum.label}
                </MosaicText>
                <MosaicText variant="caption" tone="text" weight="600">
                  {percent}%
                </MosaicText>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
