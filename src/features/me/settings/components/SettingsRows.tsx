import { useState } from 'react';
import { Switch, View } from 'react-native';

import {
  MosaicListRow,
  MosaicSelect,
  MosaicSheet,
  MosaicText,
} from '@/components/mosaic';
import { useTheme } from '@/hooks/use-theme';

export interface SettingsSwitchRowProps {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

/** A list row whose only control is the trailing switch. */
export function SettingsSwitchRow({
  title,
  subtitle,
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel,
}: SettingsSwitchRowProps) {
  const theme = useTheme();

  return (
    <MosaicListRow
      title={title}
      subtitle={subtitle}
      disabled={disabled}
      chevron={false}
      accessibilityLabel={accessibilityLabel}
      trailing={
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{
            false: theme.colors.borderStrong,
            true: theme.colors.primary,
          }}
          thumbColor={theme.colors.surface}
          ios_backgroundColor={theme.colors.borderStrong}
        />
      }
    />
  );
}

export interface SettingsChoiceOption<T extends string> {
  value: T;
  label: string;
  /** Extra line under the option label in the picker */
  description?: string;
}

export interface SettingsChoiceRowProps<T extends string> {
  title: string;
  subtitle?: string;
  value?: string;
  placeholder?: string;
  options: SettingsChoiceOption<T>[];
  onChange: (value: T) => void;
  /** Sheet title; defaults to the row title */
  sheetTitle?: string;
  disabled?: boolean;
}

/**
 * Single-choice row: shows the current label on the right and opens a bottom
 * sheet with a check mark list. Edits stay staged until the sheet is saved.
 */
export function SettingsChoiceRow<T extends string>({
  title,
  subtitle,
  value,
  placeholder,
  options,
  onChange,
  sheetTitle,
  disabled = false,
}: SettingsChoiceRowProps<T>) {
  const [visible, setVisible] = useState(false);
  const [stagedValue, setStagedValue] = useState<T | undefined>(undefined);

  const open = () => {
    const current = options.find((option) => option.label === value);
    setStagedValue(current?.value);
    setVisible(true);
  };

  const save = () => {
    if (stagedValue !== undefined) {
      onChange(stagedValue);
    }
    setVisible(false);
  };

  return (
    <>
      <MosaicListRow
        title={title}
        subtitle={subtitle}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onPress={disabled ? undefined : open}
      />

      <MosaicSheet
        visible={visible}
        title={sheetTitle ?? title}
        onClose={() => setVisible(false)}
        scrollable={false}
      >
        <MosaicSelect
          options={options}
          stagedValue={stagedValue}
          onStage={setStagedValue}
          onSave={save}
        />
      </MosaicSheet>
    </>
  );
}

/** A compact read-only value block used inside detail pages. */
export function SettingsValue({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <MosaicText variant="body" tone="text-muted">
        {label}
      </MosaicText>
      <MosaicText variant="body" className="shrink-0 text-right">
        {value}
      </MosaicText>
    </View>
  );
}
