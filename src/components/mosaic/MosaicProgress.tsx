import { View } from 'react-native';

export interface MosaicProgressProps {
  /** 0 - 1 */
  progress: number;
  className?: string;
}

/** 对应原型 .progress：8px 浅鼠尾草轨道 + 实心鼠尾草填充 */
export function MosaicProgress({ progress, className }: MosaicProgressProps) {
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      className={[
        'h-2 w-full overflow-hidden rounded-full bg-primary-muted',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <View
        className="h-full rounded-full bg-primary"
        style={{
          width: `${normalizedProgress * 100}%`,
        }}
      />
    </View>
  );
}
