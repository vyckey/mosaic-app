import type { LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';

export interface MosaicChipProps {
  label: string;
  emoji?: string;
  icon?: LucideIcon;
  /** 选中态：实心鼠尾草 + 白字（原型 .chip.active） */
  active?: boolean;
  /** 不传则渲染为纯展示标签（原型年度关键词场景） */
  onPress?: () => void;
  className?: string;
}

/** 对应原型 .chip：圆角小胶囊，用于筛选 / 标签 / 轻操作 */
export function MosaicChip({
  label,
  emoji,
  icon,
  active = false,
  onPress,
  className,
}: MosaicChipProps) {
  const textClassName = active ? 'text-primary-foreground' : 'text-text';

  const rowClassName = [
    'flex-row items-center justify-center gap-1 rounded-full px-3 py-1.5',
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
