import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import {
  MosaicButton,
  MosaicListRow,
  MosaicText,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';
import {
  maskEmail,
  maskPhone,
  useAccountStore,
  useAiMemoryStore,
  useProfileStore,
  useSettingsStore,
  type ThirdPartyProvider,
} from '@/stores';

import { SettingsConfirmDialog } from './components/SettingsConfirmDialog';
import { SettingsField } from './components/SettingsField';
import { SettingsInfoDialog } from './components/SettingsInfoDialog';
import { SettingsNote } from './components/SettingsNote';
import { SettingsPageShell } from './components/SettingsPageShell';
import { SettingsSection } from './components/SettingsSection';
import { SettingsSwitchRow } from './components/SettingsRows';

export function AccountSecurityScreen() {
  const { t } = useI18n();
  const account = useAccountStore();

  const boundProviders = Object.values(account.thirdParty).filter(Boolean).length;

  return (
    <SettingsPageShell title={t('settings.security.title')}>
      <SettingsSection>
        <MosaicListRow
          title={t('settings.security.phone')}
          value={maskPhone(account.phone)}
          onPress={() => router.push('/settings/security/phone')}
        />
        <MosaicListRow
          title={t('settings.security.email')}
          value={maskEmail(account.email)}
          onPress={() => router.push('/settings/security/email')}
        />
        <MosaicListRow
          title={t('settings.security.password')}
          subtitle={t('settings.security.passwordUpdated', {
            date: account.passwordUpdatedAt,
          })}
          onPress={() => router.push('/settings/security/password')}
        />
        <MosaicListRow
          title={t('settings.security.thirdParty')}
          subtitle={t('settings.security.thirdPartyBound')}
          value={t('settings.security.thirdPartyCount', {
            count: boundProviders,
          })}
          onPress={() => router.push('/settings/security/third-party')}
        />
      </SettingsSection>

      <SettingsSection>
        <MosaicListRow
          title={t('settings.security.devices')}
          subtitle={t('settings.security.lastActive', {
            time: account.devices[0]?.lastActive ?? '—',
          })}
          value={t('settings.security.deviceCount', {
            count: account.devices.length,
          })}
          onPress={() => router.push('/settings/security/devices')}
        />
      </SettingsSection>

      <SettingsSection>
        <MosaicListRow
          title={t('settings.security.deleteAccount')}
          subtitle={t('settings.security.deleteAccountDescription')}
          tone="danger"
          chevron={false}
          onPress={() => router.push('/settings/security/delete-account')}
        />
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function PhoneScreen() {
  const { t } = useI18n();
  const phone = useAccountStore((state) => state.phone);
  const updatePhone = useAccountStore((state) => state.updatePhone);
  const [value, setValue] = useState(phone);
  const [error, setError] = useState<string | null>(null);
  const [savedVisible, setSavedVisible] = useState(false);

  const handleSave = () => {
    if (!/^1\d{10}$/.test(value.trim())) {
      setError(t('settings.security.invalidPhone'));
      return;
    }
    setError(null);
    updatePhone(value.trim());
    setSavedVisible(true);
  };

  return (
    <SettingsPageShell title={t('settings.security.phone')}>
      <SettingsSection>
        <SettingsField
          label={t('settings.security.newPhone')}
          value={value}
          onChangeText={setValue}
          placeholder={t('settings.security.newPhonePlaceholder')}
          keyboardType="phone-pad"
          maxLength={11}
          error={error}
        />
      </SettingsSection>

      <MosaicButton size="lg" onPress={handleSave}>
        {t('settings.security.changePhone')}
      </MosaicButton>

      <SettingsInfoDialog
        visible={savedVisible}
        title={t('settings.security.phone')}
        message={t('settings.security.phoneChanged')}
        onClose={() => {
          setSavedVisible(false);
          router.back();
        }}
      />
    </SettingsPageShell>
  );
}

export function EmailScreen() {
  const { t } = useI18n();
  const email = useAccountStore((state) => state.email);
  const updateEmail = useAccountStore((state) => state.updateEmail);
  const [value, setValue] = useState(email);
  const [error, setError] = useState<string | null>(null);
  const [savedVisible, setSavedVisible] = useState(false);

  const handleSave = () => {
    if (!/^\S+@\S+\.\S+$/.test(value.trim())) {
      setError(t('settings.security.invalidEmail'));
      return;
    }
    setError(null);
    updateEmail(value.trim());
    setSavedVisible(true);
  };

  return (
    <SettingsPageShell title={t('settings.security.email')}>
      <SettingsSection>
        <SettingsField
          label={t('settings.security.newEmail')}
          value={value}
          onChangeText={setValue}
          placeholder={t('settings.security.newEmailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          error={error}
        />
      </SettingsSection>

      <MosaicButton size="lg" onPress={handleSave}>
        {t('settings.security.changeEmail')}
      </MosaicButton>

      <SettingsInfoDialog
        visible={savedVisible}
        title={t('settings.security.email')}
        message={t('settings.security.emailChanged')}
        onClose={() => {
          setSavedVisible(false);
          router.back();
        }}
      />
    </SettingsPageShell>
  );
}

export function PasswordScreen() {
  const { t } = useI18n();
  const markPasswordUpdated = useAccountStore(
    (state) => state.markPasswordUpdated,
  );
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedVisible, setSavedVisible] = useState(false);

  const handleSave = () => {
    if (current.length === 0 || next.length < 8) {
      setError(t('settings.security.passwordTooShort'));
      return;
    }
    if (next !== confirm) {
      setError(t('settings.security.passwordMismatch'));
      return;
    }
    setError(null);
    markPasswordUpdated();
    setSavedVisible(true);
  };

  return (
    <SettingsPageShell title={t('settings.security.password')}>
      <SettingsSection>
        <View className="gap-4">
          <SettingsField
            label={t('settings.security.currentPassword')}
            value={current}
            onChangeText={setCurrent}
            secureTextEntry
            autoCapitalize="none"
          />
          <SettingsField
            label={t('settings.security.newPassword')}
            value={next}
            onChangeText={setNext}
            secureTextEntry
            autoCapitalize="none"
            error={error}
          />
          <SettingsField
            label={t('settings.security.confirmPassword')}
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
      </SettingsSection>

      <MosaicButton size="lg" onPress={handleSave}>
        {t('settings.security.changePassword')}
      </MosaicButton>

      <SettingsInfoDialog
        visible={savedVisible}
        title={t('settings.security.password')}
        message={t('settings.security.passwordChanged')}
        onClose={() => {
          setSavedVisible(false);
          router.back();
        }}
      />
    </SettingsPageShell>
  );
}

const PROVIDERS: ThirdPartyProvider[] = ['apple', 'google'];

export function ThirdPartyScreen() {
  const { t } = useI18n();
  const thirdParty = useAccountStore((state) => state.thirdParty);
  const setThirdParty = useAccountStore((state) => state.setThirdParty);

  return (
    <SettingsPageShell title={t('settings.security.thirdParty')}>
      <SettingsSection>
        {PROVIDERS.map((provider) => (
          <SettingsSwitchRow
            key={provider}
            title={t(`settings.security.${provider}`)}
            subtitle={
              thirdParty[provider]
                ? t('settings.security.bound')
                : t('settings.security.unbound')
            }
            value={thirdParty[provider]}
            onValueChange={(value) => setThirdParty(provider, value)}
          />
        ))}
      </SettingsSection>
    </SettingsPageShell>
  );
}

export function DevicesScreen() {
  const { t } = useI18n();
  const devices = useAccountStore((state) => state.devices);
  const removeDevice = useAccountStore((state) => state.removeDevice);
  const logoutOtherDevices = useAccountStore(
    (state) => state.logoutOtherDevices,
  );
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [logoutAllVisible, setLogoutAllVisible] = useState(false);

  const pendingDevice = devices.find((device) => device.id === pendingId);

  return (
    <SettingsPageShell title={t('settings.security.devices')}>
      <SettingsSection>
        {devices.map((device) => (
          <MosaicListRow
            key={device.id}
            title={device.name}
            subtitle={`${device.system} · ${t('settings.security.lastActive', {
              time: device.lastActive,
            })}`}
            value={device.current ? t('settings.security.currentDevice') : undefined}
            chevron={false}
            onPress={device.current ? undefined : () => setPendingId(device.id)}
          />
        ))}
      </SettingsSection>

      <MosaicListRow
        title={t('settings.security.logoutAll')}
        tone="danger"
        chevron={false}
        onPress={() => setLogoutAllVisible(true)}
      />

      <SettingsConfirmDialog
        visible={pendingDevice !== undefined}
        title={t('settings.security.logoutConfirmTitle')}
        message={t('settings.security.logoutConfirmMessage')}
        confirmLabel={t('settings.security.logoutDevice')}
        danger
        onConfirm={() => {
          if (pendingId) {
            removeDevice(pendingId);
          }
          setPendingId(null);
        }}
        onClose={() => setPendingId(null)}
      />

      <SettingsConfirmDialog
        visible={logoutAllVisible}
        title={t('settings.security.logoutAll')}
        message={t('settings.security.logoutConfirmMessage')}
        confirmLabel={t('settings.security.logoutAll')}
        danger
        onConfirm={() => {
          logoutOtherDevices();
          setLogoutAllVisible(false);
        }}
        onClose={() => setLogoutAllVisible(false)}
      />
    </SettingsPageShell>
  );
}

export function DeleteAccountScreen() {
  const { t } = useI18n();
  const resetAccount = useAccountStore((state) => state.reset);
  const resetProfile = useProfileStore((state) => state.reset);
  const resetSettings = useSettingsStore((state) => state.resetSettings);
  const resetMemories = useAiMemoryStore((state) => state.reset);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [doneVisible, setDoneVisible] = useState(false);

  const handleDelete = () => {
    setConfirmVisible(false);
    resetAccount();
    resetProfile();
    resetSettings();
    resetMemories();
    setDoneVisible(true);
  };

  return (
    <SettingsPageShell title={t('settings.security.deleteTitle')}>
      <SettingsNote
        tone="danger"
        title={t('settings.security.deleteWarning')}
        message={t('settings.security.deleteConsequences')}
      />

      <View className="gap-2">
        <MosaicButton
          variant="destructive"
          size="lg"
          onPress={() => setConfirmVisible(true)}
        >
          {t('settings.security.deleteButton')}
        </MosaicButton>
        <MosaicText variant="tiny" tone="text-subtle" className="text-center">
          {t('settings.security.deleteConfirmMessage')}
        </MosaicText>
      </View>

      <SettingsConfirmDialog
        visible={confirmVisible}
        title={t('settings.security.deleteConfirmTitle')}
        message={t('settings.security.deleteConfirmMessage')}
        confirmLabel={t('settings.security.deleteButton')}
        danger
        onConfirm={handleDelete}
        onClose={() => setConfirmVisible(false)}
      />

      <SettingsInfoDialog
        visible={doneVisible}
        title={t('settings.security.deleteTitle')}
        message={t('settings.security.deleteDone')}
        onClose={() => router.replace('/login')}
      />
    </SettingsPageShell>
  );
}
