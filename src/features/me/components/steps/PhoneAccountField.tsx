import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import PhoneInput, { getNationalPhoneNumber, type ICountry } from 'rn-international-phone-number';

import { MosaicText } from '@/components/mosaic';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/i18n/useI18n';

import { composeE164, resolveCountry } from '../../utils/phone';

interface PhoneAccountFieldProps {
  /** 父级保存的国际号码（E.164，如 '+8613800000000'） */
  value: string;
  error?: string | null;
  onChangeText: (value: string) => void;
  /** 进入步骤时自动聚焦唤起键盘 */
  autoFocus?: boolean;
}

/**
 * 账号为手机号时的输入框：前面是区号选择器（国旗 + 拨打区号），
 * 号码本体由 rn-international-phone-number 按国家掩码格式化，
 * 对父级始终上报 E.164 国际号码。
 */
export function PhoneAccountField({
  value,
  error,
  onChangeText,
  autoFocus,
}: PhoneAccountFieldProps) {
  const { t, locale } = useI18n();
  const scheme = useColorScheme();

  const [focused, setFocused] = useState(false);
  const [country, setCountry] = useState<ICountry | null>(() => resolveCountry(value));
  const [national, setNational] = useState(() => getNationalPhoneNumber(value));

  // 事件可能成批触发（如粘贴国际号码会先换国家再换号码），
  // 回调里用 ref 保证读到的是最新国家/本地号码，而非上次渲染的闭包值。
  const countryRef = useRef(country);
  const nationalRef = useRef(national);
  // 最近一次非空号码：切换国家时库会先清空号码，用它还原，避免误退出区号选择器
  const lastNationalRef = useRef(national);

  const handleChangeCountry = (nextCountry: ICountry) => {
    // 用户已清空号码时组件早已退出手机号模式，能走到这里说明清空来自切换国家的 onSelect
    if (!nationalRef.current && lastNationalRef.current) {
      nationalRef.current = lastNationalRef.current;
      setNational(lastNationalRef.current);
    }
    countryRef.current = nextCountry;
    setCountry(nextCountry);
    onChangeText(composeE164(nationalRef.current, nextCountry));
  };

  const handleChangeNational = (nextNational: string) => {
    nationalRef.current = nextNational;
    if (nextNational) {
      lastNationalRef.current = nextNational;
    }
    setNational(nextNational);
    onChangeText(composeE164(nextNational, countryRef.current));
  };

  // 归一化：粘贴纯数字等场景下父级拿到的还不是 E.164，补全区号后上报。
  // 与当前值一致时即收敛，不会循环。
  useEffect(() => {
    const composed = composeE164(nationalRef.current, countryRef.current);
    if (value !== composed) {
      onChangeText(composed);
    }
  });

  return (
    <View className="gap-1.5">
      <View
        className={[
          'h-11 flex-row items-center rounded-tile border bg-surface',
          error ? 'border-danger' : focused ? 'border-primary' : 'border-border',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <PhoneInput
          value={national}
          onChangePhoneNumber={handleChangeNational}
          country={country}
          onChangeCountry={handleChangeCountry}
          theme={scheme === 'dark' ? 'dark' : 'light'}
          language={locale === 'zh-CN' ? 'zh' : 'en'}
          placeholderType="number"
          phoneInputPlaceholderTextColor="var(--color-text-muted)"
          phoneInputSelectionColor="var(--color-primary)"
          phoneInputStyles={{
            container: {
              height: '100%',
              borderWidth: 0,
              borderRadius: 0,
              backgroundColor: 'transparent',
            },
            flagContainer: { backgroundColor: 'transparent', paddingHorizontal: 10 },
            caret: { color: 'var(--color-text-muted)' },
            divider: { backgroundColor: 'var(--color-border)' },
            callingCode: { color: 'var(--color-text)', fontSize: 14, fontWeight: '500' },
            input: {
              color: 'var(--color-text)',
              fontSize: 14,
              paddingHorizontal: 10,
              paddingVertical: 0,
            },
          }}
          modalStyles={{
            content: { backgroundColor: 'var(--color-surface)' },
            countryName: { color: 'var(--color-text)' },
            callingCode: { color: 'var(--color-text-muted)' },
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoFocus={autoFocus}
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabelPhoneInput={t('auth.account.phoneLabel')}
          accessibilityLabelCountriesButton={t('auth.account.selectCountry')}
        />
      </View>
      {error && (
        <MosaicText variant="tiny" tone="danger">
          {error}
        </MosaicText>
      )}
    </View>
  );
}
