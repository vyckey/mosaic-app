import { router } from 'expo-router';
import {
  Bell,
  Cloud,
  Database,
  Info,
  LifeBuoy,
  Lock,
  NotebookPen,
  Palette,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react-native';
import { useState } from 'react';

import {
  MosaicListRow,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';
import {
  countEnabled,
  useAccountStore,
  useProfileStore,
  useSettingsStore,
} from '@/stores';

import { SettingsConfirmDialog } from './components/SettingsConfirmDialog';
import { SettingsPageShell } from './components/SettingsPageShell';
import { SettingsSection } from './components/SettingsSection';

import packageJson from '../../../../package.json';

export function SettingsScreen() {
  const { t } = useI18n();
  const nickname = useProfileStore((state) => state.nickname);
  const phone = useAccountStore((state) => state.phone);
  const email = useAccountStore((state) => state.email);
  const appearance = useSettingsStore((state) => state.appearance);
  const notifications = useSettingsStore((state) => state.notifications);
  const sources = useSettingsStore((state) => state.sources);
  const aiFeatures = useSettingsStore((state) => state.ai.features);
  const appLock = useSettingsStore((state) => state.security.appLock);
  const resetSettings = useSettingsStore((state) => state.resetSettings);
  const resetProfile = useProfileStore((state) => state.reset);
  const resetAccount = useAccountStore((state) => state.reset);

  const [logoutVisible, setLogoutVisible] = useState(false);

  const appearanceValue = {
    system: t('settings.appearance.themeSystem'),
    light: t('settings.appearance.themeLight'),
    dark: t('settings.appearance.themeDark'),
  }[appearance.themeMode];

  const notificationFlags = {
    dailyQuestion: notifications.dailyQuestion.enabled,
    onThisDay: notifications.onThisDay.enabled,
    lifeEvents: notifications.lifeEvents.enabled,
    dnd: notifications.dnd.enabled,
  };
  const notificationCount = countEnabled(notificationFlags);

  const connectedSources =
    (sources.weather.connected ? 1 : 0) +
    countEnabled(sources.connections);

  const handleLogout = () => {
    setLogoutVisible(false);
    resetProfile();
    resetAccount();
    resetSettings();
    router.push('/login');
  };

  return (
    <SettingsPageShell title={t('settings.title')}>
      <SettingsSection>
        <MosaicListRow
          title={t('settings.account.profile')}
          subtitle={t('settings.descriptions.account')}
          icon={User}
          value={nickname || t('settings.notSet')}
          onPress={() => router.push('/settings/profile')}
        />
        <MosaicListRow
          title={t('settings.account.security')}
          subtitle={t('settings.security.thirdPartyBound')}
          icon={ShieldCheck}
          value={
            phone && email
              ? t('settings.account.bound')
              : t('settings.account.unbound')
          }
          onPress={() => router.push('/settings/security')}
        />
      </SettingsSection>

      <SettingsSection>
        <MosaicListRow
          title={t('settings.sections.appearance')}
          subtitle={t('settings.descriptions.appearance')}
          icon={Palette}
          value={appearanceValue}
          onPress={() => router.push('/settings/appearance')}
        />
        <MosaicListRow
          title={t('settings.sections.notifications')}
          subtitle={t('settings.descriptions.notifications')}
          icon={Bell}
          value={
            notificationCount > 0
              ? t('settings.enabled')
              : t('settings.disabled')
          }
          onPress={() => router.push('/settings/notifications')}
        />
        <MosaicListRow
          title={t('settings.sections.records')}
          subtitle={t('settings.descriptions.records')}
          icon={NotebookPen}
          value={t('settings.records.defaultsValue')}
          onPress={() => router.push('/settings/records')}
        />
        <MosaicListRow
          title={t('settings.sections.sources')}
          subtitle={t('settings.descriptions.sources')}
          icon={Cloud}
          value={t('settings.sources.connectedCount', {
            count: connectedSources,
          })}
          onPress={() => router.push('/settings/sources')}
        />
        <MosaicListRow
          title={t('settings.sections.ai')}
          subtitle={t('settings.descriptions.ai')}
          icon={Sparkles}
          value={t('settings.ai.featuresValue', {
            enabled: countEnabled(aiFeatures),
            total: Object.keys(aiFeatures).length,
          })}
          onPress={() => router.push('/settings/ai')}
        />
        <MosaicListRow
          title={t('settings.sections.privacy')}
          subtitle={t('settings.descriptions.privacy')}
          icon={Lock}
          value={
            appLock.enabled
              ? t('settings.privacy.appLockOn')
              : t('settings.privacy.appLockOff')
          }
          onPress={() => router.push('/settings/privacy')}
        />
        <MosaicListRow
          title={t('settings.sections.data')}
          subtitle={t('settings.descriptions.data')}
          icon={Database}
          value={t('settings.data.storageValue')}
          onPress={() => router.push('/settings/data')}
        />
      </SettingsSection>

      <SettingsSection>
        <MosaicListRow
          title={t('settings.sections.support')}
          subtitle={t('settings.descriptions.support')}
          icon={LifeBuoy}
          onPress={() => router.push('/settings/help')}
        />
        <MosaicListRow
          title={t('settings.sections.about')}
          subtitle={t('settings.descriptions.about')}
          icon={Info}
          value={`v${packageJson.version}`}
          onPress={() => router.push('/settings/about')}
        />
      </SettingsSection>

      <SettingsSection>
        <MosaicListRow
          title={t('settings.session.switchAccount')}
          onPress={() => router.push('/login')}
        />
        <MosaicListRow
          title={t('settings.session.logout')}
          tone="danger"
          chevron={false}
          onPress={() => setLogoutVisible(true)}
        />
      </SettingsSection>

      <SettingsConfirmDialog
        visible={logoutVisible}
        title={t('settings.session.logoutConfirmTitle')}
        message={t('settings.session.logoutConfirmMessage')}
        confirmLabel={t('settings.session.logout')}
        danger
        onConfirm={handleLogout}
        onClose={() => setLogoutVisible(false)}
      />
    </SettingsPageShell>
  );
}
