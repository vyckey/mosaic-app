import type { ReactNode } from 'react';
import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { Icon } from '@/components/ui/icon';

import { MosaicGlass, type MosaicGlassProps } from './MosaicGlass';
import { MosaicText } from './MosaicText';

export interface MosaicInputProps extends TextInputProps {
  icon?: LucideIcon;
  error?: string | null;
  trailing?: ReactNode;
  containerClassName?: string;
  /**
   * Render the field on a liquid-glass surface: no solid fill, an absolute
   * MosaicGlass layer frosts behind the content and the border becomes the rim
   * (white hairline at rest, primary on focus, danger on error).
   */
  glass?: boolean;
  /** Android blur sampling target handed to the glass layer (see MosaicGlass) */
  blurTarget?: MosaicGlassProps['blurTarget'];
}

export function MosaicInput({
  icon,
  error,
  trailing,
  containerClassName,
  glass = false,
  blurTarget,
  className,
  style,
  onFocus,
  onBlur,
  ...inputProps
}: MosaicInputProps) {
  const [focused, setFocused] = useState(false);

  const borderClass = error
    ? 'border-danger'
    : focused
      ? 'border-primary'
      : glass
        ? // Rim of a resting glass field (white 55% = glassRimStyle). Arbitrary
          // value on purpose: `<theme color>/<alpha>` compiles to color-mix,
          // which NativeWind cannot evaluate on RN.
          'border-[#ffffff8c]'
        : 'border-border';

  return (
    <View className="gap-1.5">
      <View
        className={[
          // Pill radius: matches the glass button's rounded-full, so fields and
          // buttons share one corner shape across screens.
          // h-[50px] is the shared control height (Yoga treats it as border-box,
          // so the outer edge is exactly 50): the same height as the lg
          // MosaicButton, and the TextInput inside stretches to h-full so the
          // whole field stays tappable.
          'h-[50px] flex-row items-center gap-2 rounded-full border px-3',
          glass ? 'relative overflow-hidden' : 'bg-surface',
          borderClass,
          containerClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Glass layer paints first (behind everything); childless + decorative,
            so it never intercepts touches meant for the input below it. */}
        {glass && (
          <MosaicGlass
            className="absolute top-0 right-0 bottom-0 left-0"
            blurTarget={blurTarget}
          />
        )}
        {icon && <Icon as={icon} size="sm" className="text-text-muted" />}
        <TextInput
          {...inputProps}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor="var(--color-text-muted)"
          // h-full: stretch to the field's inner box so a tap anywhere focuses
          // the input, not just on a thin text strip.
          className={['h-full min-w-0 flex-1 text-body leading-none web:outline-none', className]
            .filter(Boolean)
            .join(' ')}
          style={[{ color: 'var(--color-text)', backgroundColor: 'transparent' }, style]}
        />
        {trailing}
      </View>
      {error && (
        <MosaicText variant="tiny" tone="danger">
          {error}
        </MosaicText>
      )}
    </View>
  );
}
