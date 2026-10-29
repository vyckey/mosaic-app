import { View } from 'react-native';

import {
  MosaicDialog,
  MosaicText,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

export interface SettingsInfoDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

/** Read-only content dialog used for settings documents and placeholders. */
export function SettingsInfoDialog({
  visible,
  title,
  message,
  onClose,
}: SettingsInfoDialogProps) {
  const { t } = useI18n();

  return (
    <MosaicDialog
      visible={visible}
      title={title}
      onClose={onClose}
      footer={(_, { OkBtn }) => (
        <View className="flex-row">
          {/* `OkBtn` labels itself with `common.confirm`; for a plain info
              dialog the neutral "close" wording reads better. */}
          <OkBtn>{t('common.close')}</OkBtn>
        </View>
      )}
    >
      <MosaicText variant="body" tone="text-muted">
        {message}
      </MosaicText>
    </MosaicDialog>
  );
}
