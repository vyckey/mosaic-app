import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useRef } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/i18n/useI18n';

export function CreateButton() {
  const { t } = useI18n();
  const navigating = useRef(false);

  const handlePress = () => {
    if (navigating.current) return;
    navigating.current = true;
    router.push('/create');
    setTimeout(() => {
      navigating.current = false;
    }, 500);
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Pressable
        onPress={handlePress}
        className="h-14 w-14 -translate-y-3 items-center justify-center rounded-full bg-primary shadow-sm"
        accessibilityRole="button"
        accessibilityLabel={t('common.create')}
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
