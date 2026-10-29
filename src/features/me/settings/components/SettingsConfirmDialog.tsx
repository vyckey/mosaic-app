import type { ReactNode } from 'react';
import { View } from 'react-native';

import {
  MosaicButton,
  MosaicDialog,
  MosaicText,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

export interface SettingsConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Use the destructive style for irreversible actions */
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  children?: ReactNode;
}

/** Small centred confirmation dialog with a cancel/confirm pair. */
export function SettingsConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  danger = false,
  onConfirm,
  onClose,
  children,
}: SettingsConfirmDialogProps) {
  const { t } = useI18n();

  return (
    <MosaicDialog
      visible={visible}
      title={title}
      onClose={onClose}
      onConfirm={onConfirm}
      footer={(_, { CancelBtn }) => (
        <View className="flex-row gap-2.5">
          <CancelBtn>{cancelLabel}</CancelBtn>
          <MosaicButton
            variant={danger ? 'destructive' : 'primary'}
            className="flex-1"
            onPress={onConfirm}
          >
            {confirmLabel ?? t('common.confirm')}
          </MosaicButton>
        </View>
      )}
    >
      {children ?? (
        <MosaicText variant="body" tone="text-muted" className="text-center">
          {message}
        </MosaicText>
      )}
    </MosaicDialog>
  );
}
