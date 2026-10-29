import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import {
  MosaicIcon,
  MosaicPressable,
  MosaicText,
} from '@/components/mosaic';

export interface SectionHeadingProps {
  title: string;
  icon?: LucideIcon;
  /** Text action on the right, e.g. `See all`. */
  actionLabel?: string;
  onAction?: () => void;
  /** Custom right-hand node; ignored when `actionLabel` is present. */
  trailing?: ReactNode;
  className?: string;
}

/**
 * Section title used across the Statistics page. It is intentionally lighter
 * than `MosaicSectionHeader`: the prototype uses a small "See all ›" text link
 * or a comparison caption, not the generic more-menu button.
 */
export function SectionHeading({
  title,
  icon,
  actionLabel,
  onAction,
  trailing,
  className,
}: SectionHeadingProps) {
  return (
    <View
      className={['flex-row items-center justify-between', className]
        .filter(Boolean)
        .join(' ')}
    >
      <View className="flex-row items-center gap-2">
        {icon && <MosaicIcon as={icon} size="sm" tone="primary" />}
        <MosaicText variant="subtitle" tone="text" weight="600">
          {title}
        </MosaicText>
      </View>

      {actionLabel && onAction ? (
        <MosaicPressable
          onPress={onAction}
          accessibilityLabel={actionLabel}
          className="flex-row items-center gap-0.5"
        >
          <MosaicText variant="tiny" tone="text-muted">
            {actionLabel}
          </MosaicText>
          <MosaicIcon as={ChevronRight} size="xs" tone="text-muted" />
        </MosaicPressable>
      ) : (
        trailing
      )}
    </View>
  );
}
