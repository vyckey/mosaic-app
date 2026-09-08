import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

import { MosaicIconButton } from './MosaicIconButton';

export interface MosaicSectionHeaderProps {
  title: string;
  icon?: LucideIcon;
  actionIcon?: LucideIcon;
  onAction?: () => void;
  actionAccessibilityLabel?: string;
  className?: string;
}

export function MosaicSectionHeader({
  title,
  icon,
  actionIcon,
  onAction,
  actionAccessibilityLabel = '更多',
  className,
}: MosaicSectionHeaderProps) {
  return (
    <View
      className={['flex-row items-center justify-between', className]
        .filter(Boolean)
        .join(' ')}
    >
      <View className="flex-row items-center">
        {icon && (
          <Icon as={icon} size="sm" className="mr-2 text-primary" />
        )}
        <Text className="text-base font-semibold text-foreground">{title}</Text>
      </View>

      {actionIcon && onAction && (
        <MosaicIconButton
          variant="ghost"
          size="sm"
          onPress={onAction}
          accessibilityLabel={actionAccessibilityLabel}
        >
          <Icon as={actionIcon} size="sm" className="text-text-muted" />
        </MosaicIconButton>
      )}
    </View>
  );
}
