import type { LucideIcon } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';

import { MosaicText } from './MosaicText';

interface MosaicListRowBaseProps {
  title: string;
  /** Muted line under the title (category / summary) */
  subtitle?: string;
  onPress?: () => void;
  /**
   * Show the trailing chevron. Defaults to `true` when `onPress` is provided and
   * `false` for static rows, so a non-interactive row never hints at navigation.
   */
  chevron?: boolean;
  /**
   * Custom trailing content, wins over `chevron`. Pass `null` to render nothing
   * explicitly; `undefined` keeps the default chevron behavior.
   */
  trailing?: ReactNode;
  /** Value shown between the title and the trailing content (username, state, ...) */
  value?: string;
  /** Placeholder shown when `value` is missing or empty */
  placeholder?: string;
  /**
   * Custom leading visual (avatar, emoji block, photo, ...); wins over `icon`.
   * Keep it a 36px square so MosaicList can align the dividers with the text.
   */
  leading?: ReactNode;
  /** Lucide icon rendered in the default 36px leading block */
  icon?: LucideIcon;
  /** Title color (danger for destructive actions such as sign-out) */
  tone?: 'default' | 'danger';
  /** Disable interaction, dim the row and drop the pressed feedback */
  disabled?: boolean;
  /** Screen-reader label; falls back to the row's own text content */
  accessibilityLabel?: string;
  className?: string;
}

export type MosaicListRowProps = MosaicListRowBaseProps;

/**
 * Width in px of the leading block (`h-9 w-9`) plus the row gap (`gap-3`).
 * MosaicList uses it to start dividers where the text content starts; a custom
 * `leading` must follow the same 36px square convention to stay aligned.
 */
const LEADING_INSET = 36 + 12;

/**
 * Horizontal inset (px) a divider needs so it skips the leading visual of the
 * row it closes. Returns 0 for plain text rows.
 */
export function getMosaicListRowLeadingInset(child: {
  icon?: unknown;
  leading?: unknown;
}): number {
  return child.leading || child.icon ? LEADING_INSET : 0;
}

/** Single row of a MosaicList; pair it with MosaicList to get dividers. */
export function MosaicListRow({
  title,
  subtitle,
  icon,
  leading,
  onPress,
  chevron,
  trailing,
  value,
  placeholder,
  tone = 'default',
  disabled = false,
  accessibilityLabel,
  className,
}: MosaicListRowProps) {
  // Disabled rows keep the button role but must not show pressed feedback.
  const interactive = Boolean(onPress) && !disabled;
  const showChevron = chevron ?? Boolean(onPress);

  // An empty string counts as "no value" so the placeholder can take over.
  const hasValue = value !== undefined && value !== null && value !== '';
  const displayValue = hasValue ? value : placeholder;

  const rowClassName = [
    'w-full min-h-12 flex-row items-center gap-3 py-2',
    interactive && 'active:opacity-70',
    disabled && 'opacity-40',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const body = (
    <>
      {leading ? (
        <View className="shrink-0">{leading}</View>
      ) : icon ? (
        <View className="h-9 w-9 shrink-0 items-center justify-center rounded-stat bg-primary-muted">
          <Icon as={icon} size="sm" className="text-primary-strong" />
        </View>
      ) : null}

      <View className="min-w-0 flex-1 overflow-hidden">
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className={`shrink text-body font-semibold leading-5 will-change-variable ${
            tone === 'danger' ? 'text-danger' : 'text-text'
          }`}
        >
          {title}
        </Text>

        {subtitle && (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="mt-0.5 text-tiny leading-4 text-text-muted will-change-variable"
          >
            {subtitle}
          </Text>
        )}
      </View>

      {displayValue !== undefined && (
        <MosaicText
          variant="body"
          tone={hasValue ? 'text-muted' : 'text-subtle'}
          numberOfLines={1}
          className="max-w-[40%] shrink-0 text-right"
        >
          {displayValue}
        </MosaicText>
      )}

      {trailing !== undefined ? (
        trailing
      ) : showChevron ? (
        <View className="shrink-0">
          <Icon as={ChevronRight} size="sm" className="text-text-subtle" />
        </View>
      ) : null}
    </>
  );

  if (!onPress) {
    return (
      <View className={rowClassName} accessibilityLabel={accessibilityLabel}>
        {body}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel}
      className={rowClassName}
    >
      {body}
    </Pressable>
  );
}
