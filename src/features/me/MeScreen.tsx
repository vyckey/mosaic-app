import { router } from 'expo-router';
import { Settings, User } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  MosaicButton,
  MosaicCard,
  MosaicIconBadge,
  MosaicList,
  MosaicListRow,
  MosaicPressable,
  MosaicScreen,
  MosaicText,
} from '@/components/mosaic';
import { Avatar } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/i18n/useI18n';

import { meModules } from './modules';

export function MeScreen() {
  const { t } = useI18n();
  // Tab page: the scroller owns the top inset (content scrolls under the
  // status bar); pb-40 clears the floating tab-bar capsule.
  const insets = useSafeAreaInsets();

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <MosaicScreen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-[18px] pb-40"
        contentContainerStyle={{ paddingTop: insets.top }}
        showsVerticalScrollIndicator={false}
      >
        {/* Identity header */}
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
        </View>

        {/* Self-discovery modules: 2x2 grid, each opening its own page */}
        <View className="flex-row flex-wrap gap-3">
          {meModules.map((item) => (
            <MosaicPressable
              key={item.key}
              onPress={() => router.push(`/me/${item.key}`)}
              accessibilityLabel={t(item.labelKey)}
              className="grow basis-[45%]"
            >
              <MosaicCard padded={false} className="gap-3 p-4">
                <MosaicIconBadge icon={item.icon} size="md" />
                <MosaicText
                  variant="caption"
                  tone="text"
                  weight="500"
                  truncated
                >
                  {t(item.labelKey)}
                </MosaicText>
              </MosaicCard>
            </MosaicPressable>
          ))}
        </View>

        {/* Settings entry */}
        <MosaicCard padded={false}>
          <MosaicList>
            <MosaicListRow
              title={t('me.settings')}
              icon={Settings}
              onPress={() => router.push('/settings')}
            />
          </MosaicList>
        </MosaicCard>

        {/* Account + dev-stage entries */}
        <View className="gap-3">
          <MosaicButton variant="primary" size="lg" onPress={handleLogin}>
            {t('me.loginRegister')}
          </MosaicButton>

          <MosaicButton
            variant="secondary"
            size="lg"
            onPress={() => router.push('/dev')}
          >
            {t('dev.title')}
          </MosaicButton>
        </View>
      </ScrollView>
    </MosaicScreen>
  );
}
