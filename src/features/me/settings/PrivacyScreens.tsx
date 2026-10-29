import { router } from 'expo-router';
import { useState } from 'react';
import { Linking } from 'react-native';

import { MosaicListRow } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';
import {
  useSettingsStore,
  type AutoLockDelay,
} from '@/stores';

import { SettingsInfoDialog } from './components/SettingsInfoDialog';
import { SettingsPageShell } from './components/SettingsPageShell';
import {
  SettingsChoiceRow,
  SettingsSwitchRow,
} from './components/SettingsRows';
import { SettingsSection } from './components/SettingsSection';

const PERMISSION_STATUS = {
  camera: 'granted',
  photos: 'granted',
  microphone: 'denied',
  location: 'granted',
  notifications: 'granted',
  health: 'limited',
} as const;

export function PrivacyScreen() {
  const { t } = useI18n();
  const appLock = useSettingsStore((state) => state.security.appLock);

  const granted = Object.values(PERMISSION_STATUS).filter(
    (status) => status === 'granted' || status === 'limited',
  ).length;
  const total = Object.keys(PERMISSION_STATUS).length;

  return (
    <SettingsPageShell title={t('settings.privacy.title')}>
      <SettingsSection>
        <MosaicListRow
          title={t('settings.privacy.appLock')}
          subtitle={t('settings.privacy.appLockHint')}
          value={
            appLock.enabled
              ? t('settings.privacy.appLockOn')
              : t('settings.privacy.appLockOff')
          }
          onPress={() => router.push('/settings/privacy/app-lock')}
        />
        <MosaicListRow
          title={t('settings.privacy.systemPermissions')}
          value={t('settings.privacy.permissionsValue', { granted, total })}
          onPress={() => router.push('/settings/privacy/permissions')}
        />
        <MosaicListRow
          title={t('settings.privacy.dataUsage')}
          onPress={() => router.push('/settings/privacy/data-usage')}
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function AppLockScreen() {
  const { t } = useI18n();
  const appLock = useSettingsStore((state) => state.security.appLock);
  const setSecurity = useSettingsStore((state) => state.setSecurity);

  return (
    <SettingsPageShell
      title={t('settings.privacy.appLock')}
      subtitle={t('settings.privacy.appLockHint')}
    >
      <SettingsSection>
        <SettingsSwitchRow
          title={t('settings.privacy.appLock')}
          value={appLock.enabled}
          onValueChange={(enabled) =>
            setSecurity({ appLock: { ...appLock, enabled } })
          }
        />
        <SettingsChoiceRow<AutoLockDelay>
          title={t('settings.privacy.autoLock')}
          value={
            {
              immediately: t('settings.privacy.autoLockImmediately'),
              '1m': t('settings.privacy.autoLock1m'),
              '5m': t('settings.privacy.autoLock5m'),
              '15m': t('settings.privacy.autoLock15m'),
            }[appLock.autoLock]
          }
          disabled={!appLock.enabled}
          options={[
            {
              value: 'immediately',
              label: t('settings.privacy.autoLockImmediately'),
            },
            { value: '1m', label: t('settings.privacy.autoLock1m') },
            { value: '5m', label: t('settings.privacy.autoLock5m') },
            { value: '15m', label: t('settings.privacy.autoLock15m') },
          ]}
          onChange={(autoLock) =>
            setSecurity({ appLock: { ...appLock, autoLock } })
          }
        />
        <SettingsSwitchRow
          title={t('settings.privacy.passcodeFallback')}
          subtitle={t('settings.privacy.passcodeFallbackHint')}
          value={appLock.passcodeFallback}
          disabled={!appLock.enabled}
          onValueChange={(passcodeFallback) =>
            setSecurity({ appLock: { ...appLock, passcodeFallback } })
          }
        />
      </SettingsSection>

      <SettingsSection>
        <SettingsSwitchRow
          title={t('settings.privacy.unlockOnReturn')}
          value={appLock.unlockOnReturn}
          disabled={!appLock.enabled}
          onValueChange={(unlockOnReturn) =>
            setSecurity({ appLock: { ...appLock, unlockOnReturn } })
          }
        />
        <SettingsSwitchRow
          title={t('settings.privacy.maskSwitcher')}
          subtitle={t('settings.privacy.maskSwitcherHint')}
          value={appLock.maskSwitcher}
          disabled={!appLock.enabled}
          onValueChange={(maskSwitcher) =>
            setSecurity({ appLock: { ...appLock, maskSwitcher } })
          }
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}

const PERMISSION_KEYS = [
  'camera',
  'photos',
  'microphone',
  'location',
  'notifications',
  'health',
] as const;

export function PermissionsScreen() {
  const { t } = useI18n();

  const statusLabel = {
    granted: t('settings.privacy.granted'),
    denied: t('settings.privacy.denied'),
    limited: t('settings.privacy.limited'),
  };

  return (
    <SettingsPageShell
      title={t('settings.privacy.systemPermissions')}
      subtitle={t('settings.privacy.permissionsHint')}
    >
      <SettingsSection>
        {PERMISSION_KEYS.map((key) => (
          <MosaicListRow
            key={key}
            title={t(`settings.privacy.${key}`)}
            value={statusLabel[PERMISSION_STATUS[key]]}
            onPress={() => Linking.openSettings()}
          />
        ))}
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function PrivacyDataUsageScreen() {
  const { t } = useI18n();
  const [doc, setDoc] = useState<{ title: string; message: string } | null>(
    null,
  );

  const openDoc = (title: string) =>
    setDoc({ title, message: t('settings.privacy.docPlaceholder') });

  return (
    <SettingsPageShell title={t('settings.privacy.dataUsage')}>
      <SettingsSection>
        <MosaicListRow
          title={t('settings.privacy.privacyPolicy')}
          onPress={() => openDoc(t('settings.privacy.privacyPolicy'))}
        />
        <MosaicListRow
          title={t('settings.privacy.dataUsageDoc')}
          onPress={() => openDoc(t('settings.privacy.dataUsageDoc'))}
        />
        <MosaicListRow
          title={t('settings.privacy.thirdParty')}
          onPress={() => openDoc(t('settings.privacy.thirdParty'))}
        />
        <MosaicListRow
          title={t('settings.privacy.storageRegion')}
          value={t('settings.privacy.storageRegionValue')}
          chevron={false}
        />
        <MosaicListRow
          title={t('settings.privacy.aiAuthorization')}
          value={t('settings.privacy.aiAuthorizationValue')}
          onPress={() => router.push('/settings/ai/data')}
        />
        <MosaicListRow
          title={t('settings.privacy.deletionRequest')}
          onPress={() => router.push('/settings/data/delete')}
        />
      </SettingsSection>

      <SettingsInfoDialog
        visible={doc !== null}
        title={doc?.title ?? ''}
        message={doc?.message ?? ''}
        onClose={() => setDoc(null)}
      />
    </SettingsPageShell>
  );
}
