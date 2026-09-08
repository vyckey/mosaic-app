import { Clock3, Home, MessageCircle, User } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export type AppTabName = 'today' | 'timeline' | 'chat' | 'me';

interface AppTabProps {
  name: AppTabName;
  label: string;
  isFocused?: boolean;
  onPress?: () => void;
}

const icons = {
  today: Home,
  timeline: Clock3,
  chat: MessageCircle,
  me: User,
} as const;

export function AppTab({
  name,
  label,
  isFocused = false,
  onPress,
}: AppTabProps) {
  const IconComponent = icons[name];

  return (
    <Pressable
      onPress={onPress}
      className="flex-1"
      accessibilityRole="tab"
      accessibilityState={{
        selected: isFocused,
      }}
    >
      {({ pressed }) => (
        <View
          className={[
            'flex-1 items-center justify-center',
            pressed ? 'opacity-70' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Icon
            as={IconComponent}
            size="sm"
            className={isFocused ? 'text-primary' : 'text-text-muted'}
          />

          <Text
            className={[
              'mt-1 text-xs',
              isFocused ? 'font-medium text-primary' : 'text-text-muted',
            ].join(' ')}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
