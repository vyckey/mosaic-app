import { useState } from 'react';
import { Pressable } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

import { MosaicIcon, MosaicInput, type MosaicInputProps } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { useAuthBlurTarget } from '../auth-blur-context';

type PasswordInputProps = Omit<MosaicInputProps, 'secureTextEntry' | 'trailing'>;

/** Password field with a show/hide toggle */
export function PasswordInput(props: PasswordInputProps) {
  const { t } = useI18n();
  const blurTarget = useAuthBlurTarget();
  const [visible, setVisible] = useState(false);

  return (
    <MosaicInput
      {...props}
      blurTarget={blurTarget}
      secureTextEntry={!visible}
      trailing={
        <Pressable
          onPress={() => setVisible((v) => !v)}
          hitSlop={8}
          className="px-2 py-2"
          accessibilityRole="button"
          accessibilityLabel={visible ? t('auth.credential.hidePassword') : t('auth.credential.showPassword')}
        >
          <MosaicIcon as={visible ? EyeOff : Eye} size="sm" tone="text-muted" />
        </Pressable>
      }
    />
  );
}
