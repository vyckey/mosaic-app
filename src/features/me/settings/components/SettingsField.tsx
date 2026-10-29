import { View } from 'react-native';

import { MosaicInput, MosaicText } from '@/components/mosaic';
import type { MosaicInputProps } from '@/components/mosaic';

export interface SettingsFieldProps extends MosaicInputProps {
  label: string;
}

/** Labelled text field used by settings forms. */
export function SettingsField({ label, ...inputProps }: SettingsFieldProps) {
  return (
    <View className="gap-2">
      <MosaicText variant="tiny" tone="text-muted" weight="500">
        {label}
      </MosaicText>
      <MosaicInput {...inputProps} />
    </View>
  );
}
