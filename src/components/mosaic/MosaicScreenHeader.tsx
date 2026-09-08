import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n/useI18n';

import { MosaicIconButton } from './MosaicIconButton';

export interface MosaicScreenHeaderProps {
  /** Optional page title; omit for headers that are just buttons */
  title?: string;
  /** Optional small line under the title */
  subtitle?: string;
  /** Renders the liquid-glass back button when provided */
  onBack?: () => void;
  /** Zero or more action buttons pinned to the far right */
  actions?: ReactNode;
  className?: string;
}

/**
 * Top bar for secondary screens: [glass back button] title/subtitle ... actions.
 * The header itself is transparent; every button renders on a liquid-glass surface.
 */
export function MosaicScreenHeader({
  title,
  subtitle,
  onBack,
  actions,
  className,
}: MosaicScreenHeaderProps) {
  const { t } = useI18n();

  return (
    <View
      className={['flex-row items-center gap-2.5', className]
        .filter(Boolean)
        .join(' ')}
    >
      {onBack && (
        <MosaicIconButton
          variant="glass"
          size="md"
          onPress={onBack}
          accessibilityLabel={t('common.back')}
        >
          <Icon as={ChevronLeft} size="xl" className="text-text" />
        </MosaicIconButton>
      )}

      {/* Flex spacer: keeps actions pinned right even without a title */}
      <View className="flex-1">
        {title && <Text className="text-title text-text">{title}</Text>}
        {subtitle && (
          <Text className="mt-0.5 text-tiny text-text-muted">{subtitle}</Text>
        )}
      </View>

      {actions && (
        <View className="flex-row items-center gap-2">{actions}</View>
      )}
    </View>
  );
}
