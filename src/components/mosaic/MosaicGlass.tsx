import React, { type ComponentRef } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';

import { useColorScheme } from '@/hooks/use-color-scheme';

import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from '@/components/ui/liquid-glass';

export type MosaicGlassVariant = 'regular' | 'clear';

export interface MosaicGlassProps {
  children?: React.ReactNode;

  /** NativeWind className */
  className?: string;

  /** Native layout style */
  style?: StyleProp<ViewStyle>;

  /** Glass style */
  variant?: MosaicGlassVariant;

  /** Glass tint color */
  tintColor?: string;

  /** Fallback blur intensity: 1–100 */
  blurIntensity?: number;

  /**
   * Blur sampling target on Android, provided by the caller.
   * Must be expo-blur's `BlurTargetView`, with the blurred content rendered inside it.
   */
  blurTarget?: React.RefObject<ComponentRef<typeof View> | null>;

  /** Enable the native interactive glass effect on iOS */
  interactive?: boolean;
}

/**
 * Shared chrome for liquid-glass button surfaces: an absolute circular layer
 * plus a hairline rim that keeps the glass edge visible over light backgrounds.
 */
export const glassSurfaceClassName =
  'absolute top-0 right-0 bottom-0 left-0 rounded-full';

export const glassRimStyle: ViewStyle = {
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: 'rgba(255,255,255,0.55)',
};

export function MosaicGlass({
  children,
  className,
  style,
  variant = 'regular',
  tintColor,
  blurIntensity = 40,
  blurTarget,
  interactive = false,
}: MosaicGlassProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // A childless glass layer is purely decorative (a surface behind content that
  // lives outside it, e.g. sheet panels / button fills): it must never eat
  // touches, otherwise gestures targeting views beneath it (scrolling!) break.
  // Layers that render children (tab capsule) keep default pointer events.
  const pointerEvents =
    children === undefined && !interactive ? 'none' : undefined;

  const nativeGlassAvailable =
    Platform.OS === 'ios' &&
    isGlassEffectAPIAvailable() &&
    isLiquidGlassAvailable();

  // iOS: use gluestack's native Liquid Glass wrapper
  if (nativeGlassAvailable) {
    return (
      <GlassView
        className={className}
        style={style}
        glassEffectStyle={variant}
        tintColor={tintColor}
        isInteractive={interactive}
        pointerEvents={pointerEvents}
      >
        {children}
      </GlassView>
    );
  }

  // Web: use the gluestack component's built-in backdrop-blur fallback styles
  if (Platform.OS === 'web') {
    return (
      <GlassView
        className={className}
        style={style}
        glassEffectStyle={variant}
        tintColor={tintColor}
        pointerEvents={pointerEvents}
      >
        {children}
      </GlassView>
    );
  }

  // Android / iOS without Liquid Glass:
  // wrap everything in an outer View so the BlurView never affects content layout.
  const fallbackBackground =
    tintColor ??
    (variant === 'clear'
      ? isDark
        ? 'rgba(20,20,22,0.22)'
        : 'rgba(255,255,255,0.18)'
      : isDark
        ? 'rgba(28,28,30,0.58)'
        : 'rgba(255,255,255,0.62)');

  const clampedIntensity = Math.max(1, Math.min(100, blurIntensity));
  const blurTint = isDark ? 'dark' : 'light';
  const absoluteFill = {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  return (
    <View
      className={className}
      pointerEvents={pointerEvents}
      style={[
        {
          overflow: 'hidden',
          backgroundColor: fallbackBackground,
        },
        style,
      ]}
    >
      {Platform.OS === 'android' && blurTarget ? (
        <BlurView
          pointerEvents="none"
          blurTarget={blurTarget}
          intensity={clampedIntensity}
          blurMethod="dimezisBlurViewSdk31Plus"
          tint={blurTint}
          style={absoluteFill}
        />
      ) : Platform.OS === 'ios' ? (
        // iOS fallback: native expo-blur, no blurTarget needed
        <BlurView
          pointerEvents="none"
          intensity={clampedIntensity}
          tint={blurTint}
          style={absoluteFill}
        />
      ) : null}

      {children}
    </View>
  );
}

export default MosaicGlass;
