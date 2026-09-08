import { Mail, Phone, User } from 'lucide-react-native';

import { MosaicInput } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { detectInputType } from '../../utils/validation';

import { PhoneAccountField } from './PhoneAccountField';

interface AccountFieldProps {
  value: string;
  error?: string | null;
  onChangeText?: (value: string) => void;
  /** 进入步骤时自动聚焦唤起键盘 */
  autoFocus?: boolean;
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

export function AccountField({ value, error, onChangeText, autoFocus }: AccountFieldProps) {
  const { t } = useI18n();
  const inputType = detectInputType(value);

  // 识别为手机号后，切换为「区号选择器 + 号码」的国际号码输入框
  if (inputType === 'phone' && onChangeText) {
    return (
      <PhoneAccountField
        value={value}
        error={error}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
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
      placeholder={t(PLACEHOLDER_KEYS[inputType])}
      keyboardType={KEYBOARDS[inputType]}
      autoComplete={AUTOCOMPLETE[inputType]}
      textContentType={TEXT_CONTENT_TYPES[inputType]}
      autoCapitalize="none"
      autoCorrect={false}
      autoFocus={autoFocus}
    />
  );
}
