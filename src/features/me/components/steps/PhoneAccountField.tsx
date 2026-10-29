import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import PhoneInput, { getNationalPhoneNumber, type ICountry } from 'rn-international-phone-number';

import { MosaicGlass, MosaicText, type MosaicGlassProps } from '@/components/mosaic';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/i18n/useI18n';

import { composeE164, resolveCountry } from '../../utils/phone';

interface PhoneAccountFieldProps {
  /** Parent-held international number (E.164, e.g. '+8613800000000') */
  value: string;
  error?: string | null;
  onChangeText: (value: string) => void;
  /** Auto-focus to raise the keyboard when the step opens */
  autoFocus?: boolean;
  /** Render on a liquid-glass surface (auth screens) */
  glass?: boolean;
  /** Android blur sampling target handed to the glass layer (see MosaicGlass) */
  blurTarget?: MosaicGlassProps['blurTarget'];
}

/**
 * Phone account field: a country picker (flag + dial code) in front, the
 * number body formatted by national mask via rn-international-phone-number,
 * always reporting an E.164 number to the parent.
 */
export function PhoneAccountField({
  value,
  error,
  onChangeText,
  autoFocus,
  glass = false,
  blurTarget,
}: PhoneAccountFieldProps) {
  const { t, locale } = useI18n();
  const scheme = useColorScheme();

  const [focused, setFocused] = useState(false);
  const [country, setCountry] = useState<ICountry | null>(() => resolveCountry(value));
  const [national, setNational] = useState(() => getNationalPhoneNumber(value));

  // Events can fire in batches (pasting an international number swaps the
  // country first, then the number), so refs always read the latest country /
  // national value instead of the closure from the last render.
  const countryRef = useRef(country);
  const nationalRef = useRef(national);
  // Most recent non-empty number: the lib clears the number when switching
  // countries, restore from here to avoid dropping out of phone mode.
  const lastNationalRef = useRef(national);

  const handleChangeCountry = (nextCountry: ICountry) => {
    // If the user cleared the field the lib already left phone mode; reaching
    // this handler means the clear came from the picker's onSelect.
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

  // Normalization: pasted digits etc. may reach the parent before the dial
  // code is applied — compose and report. Stops when it matches the value.
  useEffect(() => {
    const composed = composeE164(nationalRef.current, countryRef.current);
    if (value !== composed) {
      onChangeText(composed);
    }
  });

  const borderClass = error
    ? 'border-danger'
    : focused
      ? 'border-primary'
      : glass
        ? // Rim of a resting glass field (white 55% = glassRimStyle). Arbitrary
          // value on purpose: `<theme color>/<alpha>` compiles to color-mix,
          // which NativeWind cannot evaluate on RN.
          'border-[#ffffff8c]'
        : 'border-border';

  return (
    <View className="gap-1.5">
      <View
        className={[
          // h-[50px] = the shared control height, same outer size as the lg
          // MosaicButton and the pill MosaicInput fields.
          'h-[50px] flex-row items-center rounded-full border',
          glass ? 'relative overflow-hidden' : 'bg-surface',
          borderClass,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Glass layer paints first (behind everything); childless + decorative,
            so it never intercepts touches meant for the picker and input. */}
        {glass && (
          <MosaicGlass
            className="absolute top-0 right-0 bottom-0 left-0"
            blurTarget={blurTarget}
          />
        )}
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
            callingCode: { color: 'var(--color-text)', fontSize: 16, fontWeight: '500' },
            input: {
              color: 'var(--color-text)',
              fontSize: 16,
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
