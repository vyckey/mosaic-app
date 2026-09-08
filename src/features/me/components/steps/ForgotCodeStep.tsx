import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { KeyRound } from 'lucide-react-native';

import { MosaicButton, MosaicInput, MosaicText } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { useCodeCountdown } from '../../hooks/useCodeCountdown';
import { validateCode } from '../../utils/validation';

import { useAuthBlurTarget } from '../auth-blur-context';

interface ForgotCodeStepProps {
  /** 用于接收验证码的手机号/邮箱 */
  contact: string;
  onSubmit: (code: string) => void;
  onBackToLogin: () => void;
}

export function ForgotCodeStep({ contact, onSubmit, onBackToLogin }: ForgotCodeStepProps) {
  const { t } = useI18n();
  const blurTarget = useAuthBlurTarget();
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const { seconds: countdown, start: startCountdown } = useCodeCountdown();
  // Synchronous debounce: state updates cannot land between rapid taps, so a
  // ref blocks duplicate submissions.
  const submittingRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  // Sending the code as soon as the step opens
  useEffect(() => {
    console.log('request code:', contact);
    startCountdown();
  }, [contact, startCountdown]);

  const handleCodeChange = (value: string) => {
    setCodeError(null);
    setCode(value);
  };

  const handleRequestCode = () => {
    if (countdown > 0) return;
    console.log('request code:', contact);
    startCountdown();
  };

  const handleSubmit = () => {
    if (submittingRef.current) return;
    const nextError = validateCode(code);
    setCodeError(nextError);
    if (nextError) return;

    submittingRef.current = true;
    setSubmitting(true);
    onSubmit(code.trim());
  };

  return (
    <View className="w-full gap-6">
      <View className="items-center gap-2">
        <MosaicText variant="display" tone="text" weight="700">
          {t('auth.forgot.title')}
        </MosaicText>
        <MosaicText variant="caption" tone="text-muted">
          {t('auth.forgot.codeSentTo', { account: contact })}
        </MosaicText>
      </View>

      <View className="gap-3">
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
                {countdown > 0 ? `${countdown}s` : t('auth.credential.getCode')}
              </MosaicText>
            </Pressable>
          }
        />
      </View>

      {/* Primary CTA: solid sage pill — the screen's single emphasised action */}
      <MosaicButton
        variant="primary"
        size="lg"
        className="w-full"
        disabled={submitting}
        onPress={handleSubmit}
      >
        {t('auth.next')}
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
