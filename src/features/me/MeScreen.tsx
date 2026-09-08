import { Settings, User } from 'lucide-react-native';
import { router } from 'expo-router';
import { View } from 'react-native';

import {
  MosaicButton,
  MosaicCard,
  MosaicIconButton,
  MosaicPressable,
  MosaicText,
} from '@/components/mosaic';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/i18n/useI18n';

export function MeScreen() {
  const { t } = useI18n();

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <View className="flex-1 bg-background px-6 py-12">
      <View className="flex-row items-center gap-3">
        <MosaicPressable
          onPress={() => {}}
          accessibilityLabel={t('me.avatar')}
          className="rounded-full"
        >
          <Avatar className="h-16 w-16 bg-primary-muted">
            <Icon as={User} size="xl" className="h-9 w-9 text-text-muted" />
          </Avatar>
        </MosaicPressable>

        <View className="flex-1 gap-1">
          <MosaicText variant="title" tone="text" weight="600" truncated>
            {t('me.notLoggedIn')}
          </MosaicText>
          <MosaicText variant="caption" tone="text-muted" truncated>
            {t('me.loginToSync')}
          </MosaicText>
        </View>

        <MosaicIconButton variant="ghost" size="md" onPress={() => router.push('/settings')} accessibilityLabel={t('me.settings')}>
          <Icon as={Settings} size="xl" className="text-text" />
        </MosaicIconButton>
      </View>

      <MosaicButton variant="primary" size="lg" onPress={handleLogin} className="mt-8">
        {t('me.loginRegister')}
      </MosaicButton>

      <MosaicCard className="mt-8 gap-3">
        <MosaicText variant="body" tone="text" weight="500">
          {t('me.settings')}
        </MosaicText>
        <MosaicText variant="caption" tone="text-muted">
          {t('me.moreFeatures')}
        </MosaicText>
      </MosaicCard>

      <MosaicButton
        variant="secondary"
        size="lg"
        onPress={() => router.push('/dev')}
        className="mt-4"
      >
        {t('dev.title')}
      </MosaicButton>
    </View>
  );
}
