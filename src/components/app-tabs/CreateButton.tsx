import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';

export function CreateButton() {
  return (
    <View className="flex-1 items-center justify-center">
      <Pressable
        onPress={() => router.push('/create')}
        className="h-14 w-14 -translate-y-3 items-center justify-center rounded-full bg-primary shadow-sm"
        accessibilityRole="button"
        accessibilityLabel="创建"
      >
        {({ pressed }) => (
          <View className={pressed ? 'opacity-80' : ''}>
            <Icon as={Plus} size="xl" className="text-primary-foreground" />
          </View>
        )}
      </Pressable>
    </View>
  );
}
