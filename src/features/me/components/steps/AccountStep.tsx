import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Apple, Check, MessageCircle } from 'lucide-react-native';
import { router } from 'expo-router';

import { MosaicButton, MosaicDivider, MosaicIcon, MosaicText } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { detectInputType, validateAccount, type InputType } from '../../utils/validation';

import { AccountField } from './AccountField';

interface AccountStepProps {
  account: string;
  onAccountChange: (value: string) => void;
  onNext: (inputType: InputType) => void;
}

export function AccountStep({ account, onAccountChange, onNext }: AccountStepProps) {
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (value: string) => {
    setError(null);
    onAccountChange(value);
  };

  const handleNext = () => {
    const inputType = detectInputType(account);
    const nextError = validateAccount(account, inputType);
    setError(nextError);
    if (!nextError) onNext(inputType);
  };

  const handleWechatLogin = () => {
    // TODO: 接入微信登录
    console.log('wechat login');
  };

  const handleAppleLogin = () => {
    // TODO: 接入 Apple 登录
    console.log('apple login');
  };

  return (
    <View className="w-full gap-6">
      <View className="items-center gap-2">
        <MosaicText variant="display" tone="text" weight="700">
          {t('auth.loginTitle')}
        </MosaicText>
        <MosaicText variant="caption" tone="text-muted">
          {t('auth.loginSubTitle')}
        </MosaicText>
      </View>

      <View className="gap-3">
        <AccountField value={account} error={error} onChangeText={handleChange} autoFocus />
      </View>

      <MosaicButton
        variant="primary"
        size="lg"
        className="w-full"
        onPress={handleNext}
      >
        {t('auth.next')}
      </MosaicButton>

      <View className="flex-row items-center justify-center gap-1">
        <Pressable
          onPress={() => setAgreed((v) => !v)}
          hitSlop={8}
          className="flex-row items-center gap-1.5"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreed }}
          accessibilityLabel={t('auth.agreement.prefix')}
        >
          <View
            className={[
              'h-[18px] w-[18px] items-center justify-center rounded-full border',
              agreed ? 'border-primary bg-primary' : 'border-border bg-surface',
            ].join(' ')}
          >
            {agreed && <MosaicIcon as={Check} size="xs" tone="primary-foreground" />}
          </View>
          <MosaicText variant="caption" tone="text-muted">
            {t('auth.agreement.prefix')}
          </MosaicText>
        </Pressable>
        <Pressable onPress={() => router.push('/agreement')} hitSlop={8}>
          <MosaicText variant="caption" tone="primary" weight="500">
            {t('auth.agreement.name')}
          </MosaicText>
        </Pressable>
      </View>

      <View className="flex-row items-center gap-3">
        <MosaicDivider className="flex-1" />
        <MosaicText variant="caption" tone="text-muted">
          {t('auth.social.divider')}
        </MosaicText>
        <MosaicDivider className="flex-1" />
      </View>

      <View className="flex-row items-center justify-center gap-4">
        <Pressable
          onPress={handleWechatLogin}
          className="h-12 w-12 items-center justify-center rounded-full bg-success"
          accessibilityRole="button"
          accessibilityLabel={t('auth.social.wechat')}
        >
          <MosaicIcon as={MessageCircle} size="md" tone="success-foreground" />
        </Pressable>
        <Pressable
          onPress={handleAppleLogin}
          className="h-12 w-12 items-center justify-center rounded-full bg-text"
          accessibilityRole="button"
          accessibilityLabel={t('auth.social.apple')}
        >
          <MosaicIcon as={Apple} size="md" tone="primary-foreground" />
        </Pressable>
      </View>
    </View>
  );
}
