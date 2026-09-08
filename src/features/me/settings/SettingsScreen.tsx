import { ChevronRight, Info, Languages, ShieldCheck, User } from 'lucide-react-native';
import { router } from 'expo-router';
import { View } from 'react-native';

import {
  MosaicCard,
  MosaicList,
  MosaicListRow,
  MosaicText,
} from '@/components/mosaic';
import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/i18n/useI18n';

import { SettingsPageShell } from './components/SettingsPageShell';

export function SettingsScreen() {
  const { t, languagePreference } = useI18n();

  const languageLabel =
    languagePreference === 'system'
      ? t('settings.languageSystem')
      : languagePreference === 'en'
        ? t('settings.languageEnglish')
        : t('settings.languageChinese');

  const handleLogout = () => {
    console.log('logout');
  };

  return (
    <SettingsPageShell title={t('settings.title')}>
      <MosaicCard>
        <MosaicList>
          <MosaicListRow
            title={t('settings.profile')}
            icon={User}
            onPress={() => router.push('/settings/profile')}
          />
          <MosaicListRow
            title={t('settings.accountSecurity')}
            icon={ShieldCheck}
            onPress={() => router.push('/settings/security')}
          />
          <MosaicListRow
            title={t('settings.language')}
            icon={Languages}
            trailing={
              <View className="shrink-0 flex-row items-center gap-1">
                <MosaicText variant="caption" tone="text-muted">
                  {languageLabel}
                </MosaicText>
                <Icon as={ChevronRight} size="sm" className="text-text-subtle" />
              </View>
            }
            onPress={() => router.push('/settings/language')}
          />
          <MosaicListRow
            title={t('settings.about')}
            icon={Info}
            onPress={() => router.push('/settings/about')}
          />
        </MosaicList>
      </MosaicCard>

      <MosaicCard className="mt-6">
        <MosaicList>
          <MosaicListRow
            title={t('settings.switchAccount')}
            onPress={() => router.push('/login')}
          />
          <MosaicListRow
            title={t('settings.logout')}
            tone="danger"
            chevron={false}
            onPress={handleLogout}
          />
        </MosaicList>
      </MosaicCard>
    </SettingsPageShell>
  );
}
