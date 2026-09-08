import type { ReactNode } from 'react';
import type { PressableProps } from 'react-native';
import { Pressable as RNPressable } from 'react-native';

export interface MosaicPressableProps {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  pressedOpacity?: number;
  className?: string;
  accessibilityLabel?: string;
  hitSlop?: PressableProps['hitSlop'];
}

export function MosaicPressable({
  children,
  onPress,
  disabled = false,
  pressedOpacity = 0.7,
  className,
  accessibilityLabel,
  hitSlop,
}: MosaicPressableProps) {
  return (
    <RNPressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={hitSlop}
      className={[
        disabled ? 'opacity-50' : `active:opacity-[${Math.round(pressedOpacity * 100)}]`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </RNPressable>
  );
}
