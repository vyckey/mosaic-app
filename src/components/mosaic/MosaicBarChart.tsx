import { Text, View } from 'react-native';

export interface MosaicBarChartDatum {
  value: number;
  /** 柱底标签，如「1月」「一」 */
  label?: string;
}

export interface MosaicBarChartProps {
  data: MosaicBarChartDatum[];
  /** 柱区高度（不含标签行），默认 150（原型图表高度） */
  height?: number;
  className?: string;
}

/** 对应原型维度 / 仪表盘 / 周报中的简易柱状图 */
export function MosaicBarChart({
  data,
  height = 150,
  className,
}: MosaicBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const hasLabels = data.some((d) => d.label !== undefined);

  return (
    <View
      className={['flex-row items-end gap-1.5', className]
        .filter(Boolean)
        .join(' ')}
    >
      {data.map((datum, index) => (
        <View
          key={index}
          className="flex-1 items-center justify-end"
          style={{ height: hasLabels ? height + 22 : height }}
        >
          <View
            className="w-full rounded-t-tile bg-primary-soft"
            style={{
              height: Math.max((datum.value / max) * height, 15),
            }}
          />
          {datum.label !== undefined && (
            <Text className="mt-1.5 text-tiny text-text-muted">
              {datum.label}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}
