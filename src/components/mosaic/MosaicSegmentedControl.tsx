import { Pressable, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { MosaicText } from './MosaicText';

export interface MosaicSegmentedControlOption {
  value: string;
  label: string;
}

export interface MosaicSegmentedControlProps {
  options: readonly MosaicSegmentedControlOption[];
  value?: string;
  onChange?: (value: string) => void;
  /** Total track height in px (default 40). The segments fill the inner area. */
  height?: number;
  className?: string;
  accessibilityLabel?: string;
}

const TRACK_PADDING = 4;

/**
 * Pill-shaped segmented control matching the prototype's Week / Month / Year
 * switch: one raised track, an active segment filled with the primary color,
 * and equal-width segments.
 *
 * The track and the segments use explicit numeric heights instead of a
 * content-driven height: inside a column parent the row would otherwise be
 * stretched by the surrounding layout, and the read-only labels are painted
 * with `MosaicText` so they share the app's typography tokens.
 *
 * It is intentionally controlled — the caller owns `value` and reacts to
 * `onChange`, which keeps it usable for tabs, filters and any small enum.
 */
export function MosaicSegmentedControl({
  options,
  value,
  onChange,
  height = 40,
  className,
  accessibilityLabel,
}: MosaicSegmentedControlProps) {
  const theme = useTheme();
  const segmentHeight = height - TRACK_PADDING * 2;

  return (
    <View
      className={['flex-row items-center rounded-full', className]
        .filter(Boolean)
        .join(' ')}
      style={{
        height,
        padding: TRACK_PADDING,
        backgroundColor: theme.colors.surfaceMuted,
      }}
      accessibilityLabel={accessibilityLabel}
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={onChange ? () => onChange(option.value) : undefined}
            disabled={!onChange}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={option.label}
            className={onChange ? 'active:opacity-80' : undefined}
            style={{
              flex: 1,
              height: segmentHeight,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: segmentHeight / 2,
              backgroundColor: active ? theme.colors.primary : 'transparent',
            }}
          >
            <MosaicText
              variant="caption"
              weight="600"
              tone={active ? 'primary-foreground' : 'text-muted'}
              numberOfLines={1}
            >
              {option.label}
            </MosaicText>
          </Pressable>
        );
      })}
    </View>
  );
}
