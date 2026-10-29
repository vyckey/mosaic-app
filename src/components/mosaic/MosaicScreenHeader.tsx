import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n/useI18n';

import { MosaicIconButton } from './MosaicIconButton';

export interface MosaicScreenHeaderProps {
  /** Optional page title; omit for headers that are just buttons */
  title?: string;
  /** Optional small line under the title */
  subtitle?: string;
  /**
   * Custom leading element (logo, avatar, filter control, ...). Takes over the
   * first slot when provided; otherwise `onBack` renders the default back button.
   */
  leading?: ReactNode;
  /**
   * Convenience for the default first slot: renders the liquid-glass back
   * button. Ignored when `leading` is set.
   */
  onBack?: () => void;
  /**
   * Action nodes pinned to the far right, rendered left-to-right. The header
   * owns the spacing and drops falsy entries, so conditional actions can be
   * written inline (`cond && <Node />`); each node carries its own `key` and
   * is self-interactive — header actions use
   * `MosaicButton size="md" variant="glass"` to match the back button's chrome.
   */
  actions?: ReactNode[];
  className?: string;
}

/**
 * Top bar for secondary screens: [leading] title/subtitle ... actions.
 * Self-contained chrome: carries the top safe-area inset and the standard bar
 * gutter, so a page drops it straight under the frame with no inset math.
 * The header itself is transparent; every button renders on a liquid-glass surface.
 *
 * Layout note: the bar sizes to its content (min-h-11 + inset). Do NOT pass
 * `flex-1` here — as a direct child of the page frame that would stretch it
 * vertically to half the screen instead of its historical width-fill role.
 */
export function MosaicScreenHeader({
  title,
  subtitle,
  leading,
  onBack,
  actions,
  className,
}: MosaicScreenHeaderProps) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();

  return (
    <View
      className={['min-h-11 flex-row items-center gap-2.5 px-2 pb-1', className]
        .filter(Boolean)
        .join(' ')}
      // Top safe area, exactly — offsets were flattened to +0 across screens.
      // Dynamic value, so it lives in the style prop.
      style={{ paddingTop: insets.top }}
    >
      {/* First slot: a custom `leading` node wins (logo, avatar, custom
          button); otherwise `onBack` renders the default glass back button. */}
      {leading ? (
        leading
      ) : (
        onBack && (
          <MosaicIconButton
            variant="glass"
            size="md"
            onPress={onBack}
            accessibilityLabel={t('common.back')}
          >
            <Icon as={ChevronLeft} size="md" className="text-text" />
          </MosaicIconButton>
        )
      )}

      {/* Flex spacer: keeps actions pinned right even without a title.
          Both lines are single-line with tail ellipsis so an overlong title
          truncates instead of wrapping and shoving the actions off-screen. */}
      <View className="flex-1">
        {title && (
          <Text numberOfLines={1} className="text-title text-text">
            {title}
          </Text>
        )}
        {subtitle && (
          <Text numberOfLines={1} className="mt-0.5 text-tiny text-text-muted">
            {subtitle}
          </Text>
        )}
      </View>

      {actions && (
        <View className="flex-row items-center gap-2">
          {/* Falsy entries (conditional actions) are dropped before render;
              each node carries its own key per the React list rule. */}
          {actions.filter(Boolean)}
        </View>
      )}
    </View>
  );
}
