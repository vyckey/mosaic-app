import type { ReactNode } from 'react';
import { View } from 'react-native';

import { MosaicCard, MosaicList, MosaicText } from '@/components/mosaic';

export interface SettingsSectionProps {
  /** iOS-style group label above the card */
  title?: string;
  /** Helper text under the card */
  description?: string;
  children: ReactNode;
  className?: string;
  /** Turn off the card's inner padding for edge-to-edge rows */
  padded?: boolean;
}

/**
 * One grouped settings section: optional label, a card-wrapped list and an
 * optional caption. Keeps every settings page on the same iOS-like rhythm.
 */
export function SettingsSection({
  title,
  description,
  children,
  className,
  padded = true,
}: SettingsSectionProps) {
  return (
    <View className={['gap-2', className].filter(Boolean).join(' ')}>
      {title && (
        <MosaicText
          variant="caption"
          tone="text-muted"
          weight="500"
          className="px-1"
        >
          {title}
        </MosaicText>
      )}

      <MosaicCard padded={padded}>
        <MosaicList>{children}</MosaicList>
      </MosaicCard>

      {description && (
        <MosaicText variant="tiny" tone="text-subtle" className="px-1">
          {description}
        </MosaicText>
      )}
    </View>
  );
}
