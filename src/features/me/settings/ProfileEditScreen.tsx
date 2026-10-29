import { useLocalSearchParams } from 'expo-router';

import { useI18n } from '@/i18n/useI18n';
import { useProfileStore } from '@/stores';

import { SettingsTextForm } from './components/SettingsTextForm';

/** Editable text fields reachable from the profile page. */
export type ProfileEditField = 'nickname' | 'bio' | 'username';

export function ProfileEditScreen() {
  const { t } = useI18n();
  const { field } = useLocalSearchParams<{ field?: string }>();
  const profile = useProfileStore();
  const setProfile = useProfileStore((state) => state.setProfile);

  const today = new Date().toISOString().slice(0, 10);

  if (field === 'bio') {
    return (
      <SettingsTextForm
        title={t('settings.profile.editBio')}
        initialValue={profile.bio}
        placeholder={t('settings.profile.editBioPlaceholder')}
        multiline
        allowEmpty
        maxLength={120}
        onSave={(bio) => setProfile({ bio })}
      />
    );
  }

  if (field === 'username') {
    return (
      <SettingsTextForm
        title={t('settings.profile.username')}
        note={t('settings.profile.usernameCooldown', { days: 30 })}
        initialValue={profile.username}
        maxLength={20}
        onSave={(username) =>
          setProfile({ username, usernameUpdatedAt: today })
        }
      />
    );
  }

  return (
    <SettingsTextForm
      title={t('settings.profile.editNickname')}
      initialValue={profile.nickname}
      placeholder={t('settings.profile.editNicknamePlaceholder')}
      maxLength={24}
      onSave={(nickname) => setProfile({ nickname })}
    />
  );
}
