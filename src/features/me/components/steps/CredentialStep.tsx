import { KeyRound, Lock } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { MosaicButton, MosaicDivider, MosaicInput, MosaicText } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { useCodeCountdown } from '../../hooks/useCodeCountdown';
import {
  validateCode,
  validateLoginPassword,
  type InputType,
} from '../../utils/validation';

import { useAuthBlurTarget } from '../auth-blur-context';
import { PasswordInput } from './PasswordInput';

export type CredentialMethod = 'password' | 'code';
/** Shared entry: the backend (mocked here) decides login vs register */
export type AuthMode = 'login' | 'register';

interface CredentialStepProps {
  account: string;
  inputType: InputType;
  method: CredentialMethod;
  mode: AuthMode;
  onSwitchMethod: (method: CredentialMethod) => void;
  onSwitchAccount: () => void;
  onForgotPassword: () => void;
  onSubmit: (value: string) => void;
}

export function CredentialStep({
  account,
  inputType,
  method,
  mode,
  onSwitchMethod,
  onSwitchAccount,
  onForgotPassword,
  onSubmit,
}: CredentialStepProps) {
  const { t } = useI18n();
  const blurTarget = useAuthBlurTarget();

  // Titles and the alternate-path label both encode mode × method:
  // 密码登录 / 验证码登录 / 密码注册 / 验证码注册
  const keyFor = (m: CredentialMethod) =>
    mode === 'register'
      ? m === 'password'
        ? 'auth.credential.passwordRegister'
        : 'auth.credential.codeRegister'
      : m === 'password'
        ? 'auth.credential.passwordLogin'
        : 'auth.credential.codeLogin';
  const title = t(keyFor(method));
  const alternateLabel = t(keyFor(method === 'password' ? 'code' : 'password'));
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const { seconds: countdown, start: startCountdown } = useCodeCountdown();
  // Synchronous debounce: state updates cannot land between rapid taps, so a
  // ref blocks duplicate submissions.
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
      {/* Left-aligned header: title on top, account + switch action below */}
      <View className="items-start gap-2">
        <MosaicText variant="display" tone="text" weight="700">
          {title}
        </MosaicText>
        {/* Account caption with the "switch account" action on its right */}
        <View className="flex-row items-center gap-2">
          <MosaicText variant="caption" tone="text-muted">
            {account}
          </MosaicText>
          <Pressable onPress={onSwitchAccount} hitSlop={8}>
            <MosaicText variant="caption" tone="primary" weight="500">
              {t('auth.credential.switchAccount')}
            </MosaicText>
          </Pressable>
        </View>
      </View>

      {/* Extra breathing room below the header (parent gap alone felt tight) */}
      <View className="mt-3 gap-3">
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
            glass
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
            glass
            blurTarget={blurTarget}
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
                  {countdown > 0
                    ? `${countdown}s`
                    : t('auth.credential.getCode')}
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

      {/* Alternate path: an "or" divider plus a transparent button flipping
          between password and code login (username has no code option) */}
      {inputType !== 'username' && (
        <>
          <View className="flex-row items-center gap-3">
            <MosaicDivider className="flex-1" />
            <MosaicText variant="caption" tone="text-muted">
              {t('auth.or')}
            </MosaicText>
            <MosaicDivider className="flex-1" />
          </View>
          <MosaicButton
            variant="glass"
            size="lg"
            className="w-full"
            onPress={() =>
              onSwitchMethod(method === 'password' ? 'code' : 'password')
            }
          >
            {alternateLabel}
          </MosaicButton>
        </>
      )}

      {method === 'password' && (
        <View className="flex-row items-center justify-center gap-4">
          <Pressable onPress={onForgotPassword} hitSlop={8}>
            <MosaicText variant="caption" tone="text-muted">
              {t('auth.credential.forgotPassword')}
            </MosaicText>
          </Pressable>
        </View>
      )}
    </View>
  );
}
