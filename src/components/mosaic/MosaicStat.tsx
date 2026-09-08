import { Children, type ReactNode } from 'react';
import { Text, View } from 'react-native';

export interface MosaicStatProps {
  /** 大号数值，如「7.3」「892」 */
  value: string;
  /** 数值下方小字说明（原型 .stat .tiny） */
  label?: string;
  className?: string;
}

/** 对应原型 .stat：浅底数据块 */
export function MosaicStat({ value, label, className }: MosaicStatProps) {
  return (
    <View
      className={[
        'items-center rounded-stat bg-surface-muted px-3 py-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Text className="text-title leading-none text-text">{value}</Text>
      {label && (
        <Text className="mt-0.5 text-tiny leading-none text-text-muted">{label}</Text>
      )}
    </View>
  );
}

export interface MosaicStatGridProps {
  /** 子项（通常是 MosaicStat），自动均分一行 */
  children: ReactNode;
  className?: string;
}

/** 对应原型 .stats：横向均分的数据块行 */
export function MosaicStatGrid({ children, className }: MosaicStatGridProps) {
  return (
    <View
      className={['flex-row gap-2.5', className].filter(Boolean).join(' ')}
    >
      {Children.map(children, (child, index) => (
        <View key={index} className="flex-1">
          {child}
        </View>
      ))}
    </View>
  );
}
