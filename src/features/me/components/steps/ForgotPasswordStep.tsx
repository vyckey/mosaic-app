import { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Lock } from 'lucide-react-native';

import { MosaicButton, MosaicText } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { validateLoginPassword } from '../../utils/validation';

import { PasswordInput } from './PasswordInput';

interface ForgotPasswordStepProps {
  account: string;
  onSubmit: (password: string) => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordStep({ account, onSubmit, onBackToLogin }: ForgotPasswordStepProps) {
  const { t } = useI18n();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  // 同步防抖：state 更新在连续点击间来不及生效，用 ref 挡住重复提交
  const submittingRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  const handlePasswordChange = (value: string) => {
    setPasswordError(null);
    setPassword(value);
  };

  const handleConfirmChange = (value: string) => {
    setConfirmError(null);
    setConfirmPassword(value);
  };

  const handleSubmit = () => {
    if (submittingRef.current) return;

    const nextPasswordError = validateLoginPassword(password);
    setPasswordError(nextPasswordError);
    if (nextPasswordError) return;

    if (password !== confirmPassword) {
      setConfirmError(t('validation.passwordMismatch'));
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    onSubmit(password);
  };

  return (
    <View className="w-full gap-6">
      <View className="items-center gap-2">
        <MosaicText variant="display" tone="text" weight="700">
          {t('auth.forgot.resetTitle')}
        </MosaicText>
        <MosaicText variant="caption" tone="text-muted">
          {account}
        </MosaicText>
      </View>

      <View className="gap-3">
        <PasswordInput
          value={password}
          onChangeText={handlePasswordChange}
          icon={Lock}
          error={passwordError}
          placeholder={t('auth.forgot.newPasswordPlaceholder')}
          autoComplete="new-password"
          textContentType="newPassword"
          maxLength={20}
          autoFocus
        />
        <PasswordInput
          value={confirmPassword}
          onChangeText={handleConfirmChange}
          icon={Lock}
          error={confirmError}
          placeholder={t('auth.forgot.confirmPasswordPlaceholder')}
          autoComplete="new-password"
          textContentType="newPassword"
          maxLength={20}
          onSubmitEditing={handleSubmit}
        />
      </View>

      <MosaicButton
        variant="primary"
        size="lg"
        className="w-full"
        disabled={submitting}
        onPress={handleSubmit}
      >
        {t('auth.forgot.confirm')}
      </MosaicButton>

      <View className="items-center">
        <Pressable onPress={onBackToLogin} hitSlop={8}>
          <MosaicText variant="caption" tone="text-muted">
            {t('auth.forgot.backToLogin')}
          </MosaicText>
        </Pressable>
      </View>
    </View>
  );
}
