import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { MosaicButton, MosaicText } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { detectInputType, validateAccount } from '../../utils/validation';

import { AccountField } from './AccountField';

interface ForgotAccountStepProps {
  onNext: (contact: string) => void;
  onBackToLogin: () => void;
}

/** Username accounts ask for the bound phone/email first, for verification */
export function ForgotAccountStep({ onNext, onBackToLogin }: ForgotAccountStepProps) {
  const { t } = useI18n();
  const [contact, setContact] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: string) => {
    setError(null);
    setContact(value);
  };

  const handleNext = () => {
    const trimmed = contact.trim();
    const inputType = detectInputType(trimmed);
    if (inputType === 'username') {
      setError(t('validation.contactInvalid'));
      return;
    }
    const nextError = validateAccount(trimmed, inputType);
    setError(nextError);
    if (!nextError) onNext(trimmed);
  };

  return (
    <View className="w-full gap-6">
      <View className="items-center gap-2">
        <MosaicText variant="display" tone="text" weight="700">
          {t('auth.forgot.title')}
        </MosaicText>
        <MosaicText variant="caption" tone="text-muted">
          {t('auth.forgot.contactHint')}
        </MosaicText>
      </View>

      <View className="gap-3">
        <AccountField
          value={contact}
          error={error}
          onChangeText={handleChange}
          autoFocus
          glass
        />
      </View>

      {/* Primary CTA: solid sage pill — the screen's single emphasised action */}
      <MosaicButton
        variant="primary"
        size="lg"
        className="w-full"
        onPress={handleNext}
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
