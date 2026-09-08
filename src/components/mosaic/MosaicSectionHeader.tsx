import type { LucideIcon } from 'lucide-react-native';
import { MoreHorizontal } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n/useI18n';

import { MosaicIconButton } from './MosaicIconButton';

export interface MosaicSectionHeaderProps {
  title: string;
  /** 副标题，如「5 块拼图」（原型 .muted） */
  subtitle?: string;
  icon?: LucideIcon;
  /** 传入 onAction 即显示右侧按钮；actionIcon 默认 MoreHorizontal */
  actionIcon?: LucideIcon;
  onAction?: () => void;
  actionAccessibilityLabel?: string;
  /** 底部分隔线（卡片内「标题 + 列表」结构，原型 listcard header） */
  divider?: boolean;
  className?: string;
}

export function MosaicSectionHeader({
  title,
  subtitle,
  icon,
  actionIcon = MoreHorizontal,
  onAction,
  actionAccessibilityLabel,
  divider = false,
  className,
}: MosaicSectionHeaderProps) {
  const { t } = useI18n();
  const resolvedActionLabel = actionAccessibilityLabel ?? t('common.more');

  return (
    <View
      className={[
        'flex-row items-center justify-between',
        divider && 'mb-3 border-b border-border pb-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <View className="flex-row items-center gap-2">
        {icon && <Icon as={icon} size="sm" className="text-primary" />}

        <View>
          <Text className="text-title text-text">{title}</Text>
          {subtitle && (
            <Text className="mt-0.5 text-caption text-text-muted">
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {onAction && (
        <MosaicIconButton
          variant="ghost"
          size="sm"
          onPress={onAction}
          accessibilityLabel={resolvedActionLabel}
        >
          <Icon as={actionIcon} size="sm" className="text-text-muted" />
        </MosaicIconButton>
      )}
    </View>
  );
}
