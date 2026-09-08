import { View } from 'react-native';

export interface MosaicProgressProps {
  progress: number;
  className?: string;
}

export function MosaicProgress({ progress, className }: MosaicProgressProps) {
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      className={[
        'h-1.5 flex-1 overflow-hidden rounded-full bg-surface-secondary',
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
