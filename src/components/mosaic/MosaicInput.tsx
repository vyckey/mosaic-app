import type { ReactNode } from 'react';
import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';

import { MosaicGlass, type MosaicGlassProps } from './MosaicGlass';
import { MosaicText } from './MosaicText';

export interface MosaicInputProps extends TextInputProps {
  icon?: LucideIcon;
  error?: string | null;
  trailing?: ReactNode;
  containerClassName?: string;
  /**
   * Extra classes for the outer wrapper (field + error stack). Use this for
   * layout concerns (e.g. flex-1 to fill a header row): the wrapper is a
   * column around the pill, so row-sizing utilities must land there — putting
   * flex-1 on the pill itself would only affect its (unconstrained) height.
   */
  wrapperClassName?: string;
  /**
   * Business-level disabled state: maps to `editable={false}` plus the
   * disabled visuals (default border, dimmed text). Prefer it over setting
   * `editable` directly when the intent is "this field is out of order".
   */
  disabled?: boolean;
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
  wrapperClassName,
  disabled = false,
  glass = false,
  blurTarget,
  className,
  style,
  onFocus,
  onBlur,
  placeholderTextColor,
  selectionColor,
  accessibilityState,
  editable = true,
  ...inputProps
}: MosaicInputProps) {
  const [focused, setFocused] = useState(false);
  const theme = useTheme();

  const isEditable = editable && !disabled;

  // Single derived visual state — future disabled backgrounds / glass rim
  // variants hang off this instead of growing nested conditionals. `error`
  // outranks focus; a field that lost editability while focused (e.g. an
  // async submit flipping editable) drops to `disabled`, never a stale
  // focus rim.
  const fieldState: 'error' | 'focused' | 'disabled' | 'default' = error
    ? 'error'
    : focused && isEditable
      ? 'focused'
      : !isEditable
        ? 'disabled'
        : 'default';

  const borderClass = {
    error: 'border-danger',
    focused: 'border-primary',
    disabled: 'border-border',
    default: glass
      ? // Rim of a resting glass field (white 55% = glassRimStyle). Arbitrary
        // value on purpose: `<theme color>/<alpha>` compiles to color-mix,
        // which NativeWind cannot evaluate on RN.
        'border-[#ffffff8c]'
      : 'border-border',
  }[fieldState];

  // Disabled text uses the dedicated textDisabled token (palette hex)
  const textColor =
    fieldState === 'disabled' ? theme.colors.textDisabled : theme.colors.text;

  return (
    <View
      className={['gap-1.5', wrapperClassName].filter(Boolean).join(' ')}
    >
      <View
        className={[
          // Pill radius: matches the glass button's rounded-full, so fields and
          // buttons share one corner shape across screens.
          // h-[50px] is the shared control height (Yoga treats it as border-box,
          // so the outer edge is exactly 50): the same height as the lg
          // MosaicButton, and the TextInput inside stretches to h-full so the
          // whole field stays tappable.
          'relative h-[50px] flex-row items-center gap-2 overflow-hidden rounded-full border px-3',
          glass ? '' : 'bg-surface',
          borderClass,
          containerClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Layer 1 · background: the glass paints first, behind everything.
            MosaicGlass itself forces pointerEvents="none" for childless,
            non-interactive layers (its own contract), so this frost can never
            eat taps meant for the input — content always stays Layer 2. */}
        {glass && (
          <MosaicGlass
            className="absolute top-0 right-0 bottom-0 left-0"
            blurTarget={blurTarget}
          />
        )}
        {icon && <Icon as={icon} size="sm" className="text-text-muted" />}
        <TextInput
          {...inputProps}
          editable={isEditable}
          accessibilityState={{ disabled: !isEditable, ...accessibilityState }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          // Native color props take palette hex from the theme, never var():
          // placeholderTextColor/selectionColor are native attributes, not
          // styles, so the CSS-variable pipeline never sees them. Callers may
          // still override both.
          placeholderTextColor={placeholderTextColor ?? theme.colors.textMuted}
          // Sage caret across all fields (Android selection + iOS cursor)
          selectionColor={selectionColor ?? theme.colors.primary}
          // h-full: stretch to the field's inner box so a tap anywhere focuses
          // the input, not just on a thin text strip.
          className={['h-full min-w-0 flex-1 text-body leading-none web:outline-none', className]
            .filter(Boolean)
            .join(' ')}
          // color via theme hex (same native-compat rule as above); caller
          // style stays last so it can override the default text color
          style={[{ color: textColor, backgroundColor: 'transparent' }, style]}
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
