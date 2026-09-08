import type { LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export interface MosaicInputBarAction {
  icon: LucideIcon;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export interface MosaicInputBarProps {
  placeholder?: string;
  onPress?: () => void;
  actions?: MosaicInputBarAction[];
  className?: string;
}

export function MosaicInputBar({
  placeholder = '记下点什么...',
  onPress,
  actions = [],
  className,
}: MosaicInputBarProps) {
  return (
    <View
      className={[
        'border-t border-border bg-background px-5 pb-6 pt-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <View className="h-11 flex-row items-center rounded-full border border-border bg-surface px-4 shadow-sm">
        <Pressable onPress={onPress} className="flex-1 justify-center">
          <Text className="text-sm text-text-muted">{placeholder}</Text>
        </Pressable>

        {actions.map((action, index) => (
          <Pressable
            key={index}
            onPress={action.onPress}
            hitSlop={8}
            className={index === 0 ? 'ml-3' : 'ml-4'}
          >
            <Icon
              as={action.icon}
              size="sm"
              className="text-text-secondary"
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
