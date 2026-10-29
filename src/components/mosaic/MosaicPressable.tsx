import { forwardRef, type ComponentRef, type ReactNode } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Pressable as RNPressable } from 'react-native';

export interface MosaicPressableProps
  extends Omit<PressableProps, 'children' | 'onPress' | 'style'> {
  children: ReactNode;
  onPress?: PressableProps['onPress'];
  /** Press fade amount (0–1); 1 disables the fade. */
  pressedOpacity?: number;
  /** Container layout style (box sizing, margins…) — the container stays unstyled otherwise */
  style?: StyleProp<ViewStyle>;
  className?: string;
}

/**
 * Pressable with the Mosaic press feedback. Forwards its ref and the remaining
 * Pressable props, so it can also serve as a gluestack menu trigger:
 *
 * ```tsx
 * trigger={({ ...triggerProps }) => <MosaicPressable {...triggerProps} />}
 * ```
 */
export const MosaicPressable = forwardRef<
  ComponentRef<typeof RNPressable>,
  MosaicPressableProps
>(function MosaicPressable(
  {
    children,
    onPress,
    disabled = false,
    pressedOpacity = 0.7,
    style,
    className,
    accessibilityLabel,
    accessibilityRole = 'button',
    hitSlop,
    ...props
  },
  ref,
) {
  return (
    <RNPressable
      {...props}
      ref={ref}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      hitSlop={hitSlop}
      style={style}
      className={[
        disabled
          ? 'opacity-50'
          : `active:opacity-[${Math.round(pressedOpacity * 100)}]`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </RNPressable>
  );
});
