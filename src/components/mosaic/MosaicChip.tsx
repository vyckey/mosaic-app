import type { LucideIcon } from 'lucide-react-native';
import { X } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/i18n/useI18n';

export interface MosaicChipProps {
  label: string;
  emoji?: string;
  icon?: LucideIcon;
  /** 选中态：实心鼠尾草 + 白字（原型 .chip.active） */
  active?: boolean;
  /** 传入后可点击；不传则渲染为纯展示标签（原型年度关键词场景） */
  onPress?: () => void;
  /** 右侧删除按钮（最近搜索等可删除标签场景），点击不触发 onPress */
  onRemove?: () => void;
  className?: string;
}

/** 对应原型 .chip：圆角小胶囊，用于筛选 / 标签 / 轻操作 */
export function MosaicChip({
  label,
  emoji,
  icon,
  active = false,
  onPress,
  onRemove,
  className,
}: MosaicChipProps) {
  const { t } = useI18n();
  const textClassName = active ? 'text-primary-foreground' : 'text-text';

  const rowClassName = [
    'flex-row items-center justify-center gap-1 rounded-full py-1.5',
    // 有删除按钮时收窄右侧内边距，让 X 贴近边缘更平衡
    onRemove ? 'pl-3 pr-1.5' : 'px-3',
    active ? 'bg-primary' : 'bg-primary-muted',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {emoji && <Text className={`text-xs ${textClassName}`}>{emoji}</Text>}
      {icon && <Icon as={icon} size="xs" className={textClassName} />}

      <Text className={`text-xs ${textClassName}`}>{label}</Text>

      {onRemove && (
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={t('common.delete')}
          className="pl-0.5 active:opacity-70"
        >
          <Icon as={X} size="xs" className={textClassName} />
        </Pressable>
      )}
    </>
  );

  if (!onPress) {
    return <View className={rowClassName}>{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={`${rowClassName} active:opacity-80`}
    >
      {content}
    </Pressable>
  );
}
