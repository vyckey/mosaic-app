import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform } from 'react-native';

import { MosaicCard, MosaicList, MosaicListRow } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { SettingsPageShell } from './components/SettingsPageShell';
import { useProfile } from './profile-context';

function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DEFAULT_DATE = new Date(2000, 0, 1);

export function BirthdayScreen() {
  const { t } = useI18n();
  const { birthday, setBirthday } = useProfile();
  const [date, setDate] = useState(() =>
    birthday ? new Date(birthday) : DEFAULT_DATE,
  );
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'dismissed' || !selected) {
      return;
    }
    setDate(selected);
    setBirthday(toDateString(selected));
  };

  const handleRowPress = () => {
    if (Platform.OS === 'android') {
      setShowPicker(true);
      return;
    }
    setShowPicker((open) => !open);
  };

  return (
    <SettingsPageShell title={t('settings.birthday')}>
      <MosaicCard>
        <MosaicList>
          <MosaicListRow
            title={t('settings.birthday')}
            value={birthday || undefined}
            placeholder={birthday ? undefined : t('settings.notSet')}
            chevron={false}
            onPress={handleRowPress}
          />
        </MosaicList>
      </MosaicCard>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={handleChange}
        />
      )}
    </SettingsPageShell>
  );
}
