import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/i18n/useI18n';

import { MosaicIconButton } from './MosaicIconButton';

export interface MosaicScreenHeaderProps {
  title: string;
  /** 标题下小字，原型常用「拼图 · 看见完整的我」 */
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
  className?: string;
}

/** 对应原型 back()：二级页面的「‹ 标题 + 小字」头部 */
export function MosaicScreenHeader({
  title,
  subtitle,
  onBack,
  right,
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
          variant="ghost"
          size="md"
          onPress={onBack}
          accessibilityLabel={t('common.back')}
        >
          <Icon as={ChevronLeft} size="xl" className="text-text" />
        </MosaicIconButton>
      )}

      <View className="flex-1">
        <Text className="text-title text-text">{title}</Text>
        {subtitle && (
          <Text className="mt-0.5 text-tiny text-text-muted">{subtitle}</Text>
        )}
      </View>

      {right}
    </View>
  );
}
