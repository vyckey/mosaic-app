import type { LucideIcon } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { Icon } from '@/components/ui/icon';

export interface MosaicIconBadgeProps {
  /** 二选一：矢量图标 */
  icon?: LucideIcon;
  /** 二选一：emoji（原型 .emoji 记录图标块） */
  emoji?: string;
  size?: 'sm' | 'md';
  tone?: 'sage' | 'soft';
  className?: string;
}

const sizeClassName = {
  sm: 'h-8 w-8 rounded-tile',
  md: 'h-9 w-9 rounded-tile',
};

const toneClassName = {
  sage: 'bg-primary-muted',
  soft: 'bg-primary-soft',
};

export function MosaicIconBadge({
  icon,
  emoji,
  size = 'md',
  tone = 'sage',
  className,
}: MosaicIconBadgeProps) {
  return (
    <View
      className={[
        'items-center justify-center',
        sizeClassName[size],
        toneClassName[tone],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {emoji ? (
        <Text className={size === 'sm' ? 'text-base' : 'text-lg'}>
          {emoji}
        </Text>
      ) : icon ? (
        <Icon as={icon} size="sm" className="text-primary-strong" />
      ) : null}
    </View>
  );
}
