import { router } from 'expo-router';
import { useState } from 'react';

import {
  MosaicCard,
  MosaicList,
  MosaicListRow,
  MosaicSelect,
  MosaicSheet,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { SettingsPageShell } from './components/SettingsPageShell';
import { useProfile, type Gender } from './profile-context';

const GENDER_OPTIONS: { value: Gender; labelKey: string }[] = [
  { value: 'male', labelKey: 'settings.genderMale' },
  { value: 'female', labelKey: 'settings.genderFemale' },
  { value: 'other', labelKey: 'settings.genderOther' },
];

export function ProfileScreen() {
  const { t } = useI18n();
  const { gender, setGender, birthday } = useProfile();
  const [stagedGender, setStagedGender] = useState<Gender | undefined>(
    undefined,
  );
  const [genderSheetOpen, setGenderSheetOpen] = useState(false);

  const handlePlaceholderPress = () => {};
  const notSet = t('settings.notSet');

  const genderOption = GENDER_OPTIONS.find(
    (option) => option.value === gender,
  );
  const genderLabel = genderOption ? t(genderOption.labelKey) : undefined;

  const openGenderSheet = () => {
    setStagedGender(gender || undefined);
    setGenderSheetOpen(true);
  };

  const saveGenderSheet = () => {
    if (stagedGender && stagedGender !== gender) {
      setGender(stagedGender);
    }
    setGenderSheetOpen(false);
  };

  return (
    <SettingsPageShell title={t('settings.profile')}>
      <MosaicCard>
        <MosaicList>
          <MosaicListRow
            title={t('settings.username')}
            placeholder={notSet}
            onPress={handlePlaceholderPress}
          />
          <MosaicListRow
            title={t('settings.nickname')}
            placeholder={notSet}
            onPress={handlePlaceholderPress}
          />
        </MosaicList>
      </MosaicCard>

      <MosaicCard className="mt-6">
        <MosaicList>
          <MosaicListRow
            title={t('settings.signature')}
            placeholder={notSet}
            onPress={handlePlaceholderPress}
          />
        </MosaicList>
      </MosaicCard>

      <MosaicCard className="mt-6">
        <MosaicList>
          <MosaicListRow
            title={t('settings.gender')}
            value={genderLabel}
            placeholder={genderLabel ? undefined : notSet}
            onPress={openGenderSheet}
          />
          <MosaicListRow
            title={t('settings.birthday')}
            value={birthday || undefined}
            placeholder={birthday ? undefined : notSet}
            onPress={() => router.push('/settings/birthday')}
          />
          <MosaicListRow
            title={t('settings.region')}
            placeholder={notSet}
            onPress={handlePlaceholderPress}
          />
          <MosaicListRow
            title={t('settings.occupation')}
            placeholder={notSet}
            onPress={handlePlaceholderPress}
          />
          <MosaicListRow
            title={t('settings.school')}
            placeholder={notSet}
            onPress={handlePlaceholderPress}
          />
        </MosaicList>
      </MosaicCard>

      <MosaicSheet
        visible={genderSheetOpen}
        onClose={saveGenderSheet}
        title={t('settings.gender')}
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
    </SettingsPageShell>
  );
}
