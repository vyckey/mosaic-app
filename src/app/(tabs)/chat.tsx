import { Text, View } from 'react-native';

import { useI18n } from '@/i18n/useI18n';

export default function ChatScreen() {
  const { t } = useI18n();

  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text className="text-text text-2xl font-bold">{t('tab.chat')}</Text>
    </View>
  );
}
