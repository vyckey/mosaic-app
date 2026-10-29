import type { LucideIcon } from 'lucide-react-native';
import { X } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/i18n/useI18n';

/** Chip size levels: `sm` is the compact default, `md` is one step larger. */
export type MosaicChipSize = 'sm' | 'md';

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
  /** 尺寸档位；默认 sm 保持原有的紧凑外观 */
  size?: MosaicChipSize;
  className?: string;
}

interface ChipSizeConfig {
  /** Horizontal/vertical padding when the chip has no remove button */
  container: string;
  /** Padding when a remove button sits on the right, so the X hugs the edge */
  removable: string;
  text: string;
  /** Icon size token matching the label scale */
  icon: 'xs' | 'sm';
}

const sizeConfig: Record<MosaicChipSize, ChipSizeConfig> = {
  sm: {
    container: 'px-3 py-1.5',
    removable: 'pl-3 pr-1.5 py-1.5',
    text: 'text-xs',
    icon: 'xs',
  },
  md: {
    container: 'px-3.5 py-2',
    removable: 'pl-3.5 pr-2 py-2',
    text: 'text-sm',
    icon: 'sm',
  },
};

/** 对应原型 .chip：圆角小胶囊，用于筛选 / 标签 / 轻操作 */
export function MosaicChip({
  label,
  emoji,
  icon,
  active = false,
  onPress,
  onRemove,
  size = 'sm',
  className,
}: MosaicChipProps) {
  const { t } = useI18n();
  const config = sizeConfig[size];
  const textClassName = active ? 'text-primary-foreground' : 'text-text';

  const rowClassName = [
    'flex-row items-center justify-center gap-1 rounded-full',
    onRemove ? config.removable : config.container,
    active ? 'bg-primary' : 'bg-primary-muted',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {emoji && <Text className={`${config.text} ${textClassName}`}>{emoji}</Text>}
      {icon && <Icon as={icon} size={config.icon} className={textClassName} />}

      <Text className={`${config.text} ${textClassName}`}>{label}</Text>

      {onRemove && (
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={t('common.delete')}
          className="pl-0.5 active:opacity-70"
        >
          <Icon as={X} size={config.icon} className={textClassName} />
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
