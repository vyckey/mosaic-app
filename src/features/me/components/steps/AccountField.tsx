import { Mail, Phone, User } from 'lucide-react-native';

import { MosaicInput } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { detectInputType } from '../../utils/validation';

import { useAuthBlurTarget } from '../auth-blur-context';
import { PhoneAccountField } from './PhoneAccountField';

interface AccountFieldProps {
  value: string;
  error?: string | null;
  onChangeText?: (value: string) => void;
  /** Auto-focus to raise the keyboard when the step opens */
  autoFocus?: boolean;
  /** Render on a liquid-glass surface (auth screens) */
  glass?: boolean;
}

const ICONS = { email: Mail, phone: Phone, username: User } as const;
const PLACEHOLDER_KEYS = {
  email: 'auth.account.emailPlaceholder',
  phone: 'auth.account.phonePlaceholder',
  username: 'auth.account.usernamePlaceholder',
} as const;
const KEYBOARDS = { email: 'email-address', phone: 'phone-pad', username: 'default' } as const;
const AUTOCOMPLETE = { email: 'email', phone: 'tel', username: 'username' } as const;
const TEXT_CONTENT_TYPES = {
  email: 'emailAddress',
  phone: 'telephoneNumber',
  username: 'username',
} as const;

export function AccountField({
  value,
  error,
  onChangeText,
  autoFocus,
  glass = false,
}: AccountFieldProps) {
  const { t } = useI18n();
  const blurTarget = useAuthBlurTarget();
  const inputType = detectInputType(value);

  // Once the value reads as a phone number, switch to the international
  // "country picker + national number" field
  if (inputType === 'phone' && onChangeText) {
    return (
      <PhoneAccountField
        value={value}
        error={error}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
        glass={glass}
        blurTarget={blurTarget}
      />
    );
  }

  return (
    <MosaicInput
      value={value}
      onChangeText={onChangeText}
      editable={onChangeText != null}
      icon={ICONS[inputType]}
      error={error}
      // Empty field: one combined hint covering every accepted account type;
      // once the input hints at a type, swap to that type's example value.
      placeholder={
        value.trim() ? t(PLACEHOLDER_KEYS[inputType]) : t('auth.account.placeholder')
      }
      keyboardType={KEYBOARDS[inputType]}
      autoComplete={AUTOCOMPLETE[inputType]}
      textContentType={TEXT_CONTENT_TYPES[inputType]}
      autoCapitalize="none"
      autoCorrect={false}
      autoFocus={autoFocus}
      glass={glass}
      blurTarget={blurTarget}
    />
  );
}
