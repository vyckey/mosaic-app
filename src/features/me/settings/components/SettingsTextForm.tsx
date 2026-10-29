import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import {
  MosaicButton,
  MosaicInput,
  MosaicText,
  MosaicTextArea,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { SettingsPageShell } from './SettingsPageShell';

export interface SettingsTextFormProps {
  title: string;
  /** Small helper line above the field (limits, cooldowns, …) */
  note?: string;
  initialValue: string;
  placeholder?: string;
  /** Render a multi-line field instead of a single-line input */
  multiline?: boolean;
  /** Allow saving an empty string (e.g. clearing a bio) */
  allowEmpty?: boolean;
  maxLength?: number;
  /** Called with the trimmed draft; the form closes itself after saving. */
  onSave: (value: string) => void;
}

/**
 * Single-task text editor used by the settings tertiary pages.
 *
 * A dedicated screen (instead of a sheet) keeps the keyboard from covering the
 * field: Modal + KeyboardAvoidingView does not lift bottom sheets on Android.
 */
export function SettingsTextForm({
  title,
  note,
  initialValue,
  placeholder,
  multiline = false,
  allowEmpty = false,
  maxLength = 60,
  onSave,
}: SettingsTextFormProps) {
  const { t } = useI18n();
  const [draft, setDraft] = useState(initialValue);

  const canSave = allowEmpty || draft.trim().length > 0;

  const handleSave = () => {
    if (!canSave) {
      return;
    }
    onSave(draft.trim());
    router.back();
  };

  return (
    <SettingsPageShell title={title}>
      <View className="gap-3">
        {note && (
          <MosaicText variant="tiny" tone="text-muted" className="px-1">
            {note}
          </MosaicText>
        )}

        {multiline ? (
          <View className="rounded-card border border-border bg-surface p-[18px]">
            <MosaicTextArea
              value={draft}
              onChangeText={setDraft}
              placeholder={placeholder}
              maxLength={maxLength}
              minHeight={140}
              maxHeight={220}
              autoFocus
            />
          </View>
        ) : (
          <MosaicInput
            value={draft}
            onChangeText={setDraft}
            placeholder={placeholder}
            maxLength={maxLength}
            autoFocus
          />
        )}
      </View>

      <MosaicButton size="lg" onPress={handleSave} disabled={!canSave}>
        {t('common.save')}
      </MosaicButton>
    </SettingsPageShell>
  );
}
