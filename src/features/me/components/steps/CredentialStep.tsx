import { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { KeyRound, Lock } from 'lucide-react-native';

import { MosaicButton, MosaicInput, MosaicText } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { useCodeCountdown } from '../../hooks/useCodeCountdown';
import { validateCode, validateLoginPassword, type InputType } from '../../utils/validation';

import { PasswordInput } from './PasswordInput';

export type CredentialMethod = 'password' | 'code';

interface CredentialStepProps {
  account: string;
  inputType: InputType;
  method: CredentialMethod;
  onSwitchMethod: (method: CredentialMethod) => void;
  onSwitchAccount: () => void;
  onForgotPassword: () => void;
  onSubmit: (value: string) => void;
}

export function CredentialStep({
  account,
  inputType,
  method,
  onSwitchMethod,
  onSwitchAccount,
  onForgotPassword,
  onSubmit,
}: CredentialStepProps) {
  const { t } = useI18n();
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const { seconds: countdown, start: startCountdown } = useCodeCountdown();
  // 同步防抖：state 更新在连续点击间来不及生效，用 ref 挡住重复提交
  const submittingRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  const handlePasswordChange = (value: string) => {
    setPasswordError(null);
    setPassword(value);
  };

  const handleCodeChange = (value: string) => {
    setCodeError(null);
    setCode(value);
  };

  const handleRequestCode = () => {
    if (countdown > 0) return;
    console.log('request code:', account);
    startCountdown();
  };

  const handleSubmit = () => {
    if (submittingRef.current) return;

    if (method === 'password') {
      const nextError = validateLoginPassword(password);
      setPasswordError(nextError);
      if (nextError) return;
    } else {
      const nextError = validateCode(code);
      setCodeError(nextError);
      if (nextError) return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    onSubmit(method === 'password' ? password : code.trim());
  };

  return (
    <View className="w-full gap-6">
      <View className="items-center gap-2">
        <MosaicText variant="display" tone="text" weight="700">
          {method === 'password' ? t('auth.credential.welcomeBack') : t('auth.credential.confirmItsYou')}
        </MosaicText>
        <Pressable onPress={onSwitchAccount} hitSlop={8}>
          <MosaicText variant="caption" tone="text-muted">
            {account}
          </MosaicText>
        </Pressable>
      </View>

      <View className="gap-3">
        {method === 'password' ? (
          <PasswordInput
            value={password}
            onChangeText={handlePasswordChange}
            icon={Lock}
            error={passwordError}
            placeholder={t('auth.credential.passwordPlaceholder')}
            autoComplete="current-password"
            textContentType="password"
            maxLength={20}
            autoFocus
            onSubmitEditing={handleSubmit}
          />
        ) : (
          <MosaicInput
            value={code}
            onChangeText={handleCodeChange}
            icon={KeyRound}
            error={codeError}
            placeholder={t('auth.credential.codePlaceholder')}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            maxLength={6}
            autoFocus
            containerClassName="pl-3 pr-1.5"
            trailing={
              <Pressable
                onPress={handleRequestCode}
                disabled={countdown > 0}
                hitSlop={8}
                className="px-2 py-2"
              >
                <MosaicText
                  variant="caption"
                  tone={countdown > 0 ? 'text-muted' : 'primary'}
                  weight="500"
                >
                  {countdown > 0 ? `${countdown}s` : t('auth.credential.getCode')}
                </MosaicText>
              </Pressable>
            }
          />
        )}
      </View>

      <MosaicButton
        variant="primary"
        size="lg"
        className="w-full"
        disabled={submitting}
        onPress={handleSubmit}
      >
        {t('auth.credential.login')}
      </MosaicButton>

      <View className="flex-row items-center justify-center gap-4">
        {inputType !== 'username' && (
          <Pressable
            onPress={() => onSwitchMethod(method === 'password' ? 'code' : 'password')}
            hitSlop={8}
          >
            <MosaicText variant="caption" tone="primary" weight="500">
              {method === 'password' ? t('auth.credential.codeLogin') : t('auth.credential.passwordLogin')}
            </MosaicText>
          </Pressable>
        )}
        <Pressable onPress={onSwitchAccount} hitSlop={8}>
          <MosaicText variant="caption" tone="text-muted">
            {t('auth.credential.switchAccount')}
          </MosaicText>
        </Pressable>
        {method === 'password' && (
          <Pressable onPress={onForgotPassword} hitSlop={8}>
            <MosaicText variant="caption" tone="text-muted">
              {t('auth.credential.forgotPassword')}
            </MosaicText>
          </Pressable>
        )}
      </View>
    </View>
  );
}
