import type { LucideIcon } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';

import { MosaicText } from './MosaicText';

export interface MosaicListRowProps {
  title: string;
  /** 标题下的灰色小字（分类名 / 摘要） */
  subtitle?: string;
  /** 左侧固定宽度时间，如 09:15（原型 .fragtime） */
  time?: string;
  /** 左侧 emoji 图标块（与 icon 二选一） */
  emoji?: string;
  icon?: LucideIcon;
  onPress?: () => void;
  /** 默认显示右侧 › */
  chevron?: boolean;
  /** 自定义右侧内容，优先于 chevron */
  trailing?: ReactNode;
  /** title 与 trailing 之间的值展示（如 username、绑定状态） */
  value?: string;
  /** value 为空时的占位文案 */
  placeholder?: string;
  /** 标题颜色（danger 用于退出登录等破坏性操作） */
  tone?: 'default' | 'danger';
  className?: string;
}

/** 对应原型 .frag 行；配合 MosaicList 使用获得分隔线 */
export function MosaicListRow({
  title,
  subtitle,
  time,
  emoji,
  icon,
  onPress,
  chevron = true,
  trailing,
  value,
  placeholder,
  tone = 'default',
  className,
}: MosaicListRowProps) {
  const rowClassName = [
    'w-full flex-row items-center gap-3 py-2',
    onPress && 'active:opacity-70',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const body = (
    <>
      {time && (
        <Text className="w-11 shrink-0 text-tiny leading-4 text-text-muted will-change-variable">
          {time}
        </Text>
      )}

      {emoji ? (
        <View className="h-9 w-9 shrink-0 items-center justify-center rounded-stat bg-primary-muted">
          <Text className="text-lg">{emoji}</Text>
        </View>
      ) : icon ? (
        <View className="h-9 w-9 shrink-0 items-center justify-center rounded-stat bg-primary-muted">
          <Icon as={icon} size="sm" className="text-primary-strong" />
        </View>
      ) : null}

      <View className="min-w-0 flex-1 overflow-hidden">
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className={`shrink text-body font-semibold leading-5 will-change-variable ${
            tone === 'danger' ? 'text-danger' : 'text-text'
          }`}
        >
          {title}
        </Text>

        {subtitle && (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="mt-0.5 text-tiny leading-4 text-text-muted will-change-variable"
          >
            {subtitle}
          </Text>
        )}
      </View>

      {(value || placeholder) && (
        <MosaicText
          variant="body"
          tone={value ? 'text-muted' : 'text-subtle'}
          numberOfLines={1}
          className="max-w-[50%] shrink-0 text-right"
        >
          {value || placeholder}
        </MosaicText>
      )}

      {trailing ??
        (chevron && (
          <View className="shrink-0">
            <Icon as={ChevronRight} size="sm" className="text-text-subtle" />
          </View>
        ))}
    </>
  );

  if (!onPress) {
    return <View className={rowClassName}>{body}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={rowClassName}
    >
      {body}
    </Pressable>
  );
}
