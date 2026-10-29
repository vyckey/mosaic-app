import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { User } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import {
  MosaicImage,
  MosaicListRow,
  MosaicSelect,
  MosaicSheet,
} from '@/components/mosaic';
import { Icon } from '@/components/ui/icon';
import { useI18n } from '@/i18n/useI18n';
import {
  getUsernameCooldownDays,
  useProfileStore,
  type Gender,
} from '@/stores';

import { SettingsInfoDialog } from './components/SettingsInfoDialog';
import { SettingsPageShell } from './components/SettingsPageShell';
import { SettingsSection } from './components/SettingsSection';

const GENDER_OPTIONS: { value: Gender; labelKey: string }[] = [
  { value: 'male', labelKey: 'settings.profile.genderMale' },
  { value: 'female', labelKey: 'settings.profile.genderFemale' },
  { value: 'other', labelKey: 'settings.profile.genderOther' },
];

export function ProfileScreen() {
  const { t } = useI18n();
  const profile = useProfileStore();
  const setProfile = useProfileStore((state) => state.setProfile);

  const [genderSheetOpen, setGenderSheetOpen] = useState(false);
  const [stagedGender, setStagedGender] = useState<Gender | undefined>(
    undefined,
  );
  const [avatarPermissionVisible, setAvatarPermissionVisible] = useState(false);

  const cooldownDays = getUsernameCooldownDays(profile.usernameUpdatedAt);
  const usernameLocked = cooldownDays > 0;

  const genderOption = GENDER_OPTIONS.find(
    (option) => option.value === profile.gender,
  );
  const genderLabel = genderOption ? t(genderOption.labelKey) : undefined;

  const avatar = profile.avatarUri ? (
    <MosaicImage
      source={{ uri: profile.avatarUri }}
      width={36}
      height={36}
      radius="full"
    />
  ) : (
    <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-muted">
      <Icon as={User} size="sm" className="text-primary-strong" />
    </View>
  );

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setAvatarPermissionVisible(true);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfile({ avatarUri: result.assets[0].uri });
    }
  };

  const openGenderSheet = () => {
    setStagedGender(profile.gender || undefined);
    setGenderSheetOpen(true);
  };

  const saveGenderSheet = () => {
    if (stagedGender !== undefined) {
      setProfile({ gender: stagedGender });
    }
    setGenderSheetOpen(false);
  };

  return (
    <SettingsPageShell title={t('settings.profile.title')}>
      <SettingsSection>
        <MosaicListRow
          title={t('settings.profile.changeAvatar')}
          subtitle={t('settings.profile.avatar')}
          leading={avatar}
          onPress={pickAvatar}
        />
        <MosaicListRow
          title={t('settings.profile.username')}
          subtitle={
            usernameLocked
              ? t('settings.profile.usernameCooldownDays', {
                  days: cooldownDays,
                })
              : undefined
          }
          value={profile.username}
          disabled={usernameLocked}
          onPress={() =>
            router.push({
              pathname: '/settings/profile/edit',
              params: { field: 'username' },
            })
          }
        />
        <MosaicListRow
          title={t('settings.profile.nickname')}
          value={profile.nickname || undefined}
          placeholder={t('settings.notSet')}
          onPress={() =>
            router.push({
              pathname: '/settings/profile/edit',
              params: { field: 'nickname' },
            })
          }
        />
        <MosaicListRow
          title={t('settings.profile.bio')}
          value={profile.bio || undefined}
          placeholder={t('settings.profile.bioEmpty')}
          onPress={() =>
            router.push({
              pathname: '/settings/profile/edit',
              params: { field: 'bio' },
            })
          }
        />
        <MosaicListRow
          title={t('settings.profile.registeredAt')}
          value={profile.registeredAt}
          chevron={false}
        />
      </SettingsSection>

      <SettingsSection title={t('settings.profile.more')}>
        <MosaicListRow
          title={t('settings.profile.gender')}
          value={genderLabel}
          placeholder={t('settings.notSet')}
          onPress={openGenderSheet}
        />
        <MosaicListRow
          title={t('settings.profile.birthday')}
          value={profile.birthday || undefined}
          placeholder={t('settings.notSet')}
          onPress={() => router.push('/settings/birthday')}
        />
      </SettingsSection>

      <MosaicSheet
        visible={genderSheetOpen}
        onClose={saveGenderSheet}
        title={t('settings.profile.gender')}
        scrollable={false}
      >
        <MosaicSelect
          options={GENDER_OPTIONS.map((option) => ({
            label: t(option.labelKey),
            value: option.value,
          }))}
          stagedValue={stagedGender}
          onStage={setStagedGender}
          onSave={saveGenderSheet}
        />
      </MosaicSheet>

      <SettingsInfoDialog
        visible={avatarPermissionVisible}
        title={t('settings.profile.chooseAvatar')}
        message={t('settings.profile.photoPermission')}
        onClose={() => setAvatarPermissionVisible(false)}
      />
    </SettingsPageShell>
  );
}
