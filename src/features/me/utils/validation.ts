import { isValidPhoneNumber } from 'rn-international-phone-number';

import i18n from '@/i18n';

import { resolveCountry } from './phone';

export type InputType = 'email' | 'phone' | 'username';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 根据输入内容自动识别账号类型：含 @ 视为邮箱，+号或纯数字视为手机号，其余视为用户名 */
export function detectInputType(value: string): InputType {
  const trimmed = value.trim();
  if (trimmed.includes('@')) return 'email';
  if (trimmed.startsWith('+') || /^\d+$/.test(trimmed)) return 'phone';
  return 'username';
}

export function validateAccount(value: string, inputType: InputType): string | null {
  const trimmed = value.trim();

  if (inputType === 'phone') {
    const digits = trimmed.replace(/\D/g, '');
    if (!digits) return i18n.t('validation.phoneRequired');
    // 国际号码按其所属国家校验；纯数字（尚未带区号）按默认国家校验
    const country = resolveCountry(trimmed);
    if (!country || !isValidPhoneNumber(trimmed, country)) {
      return i18n.t('validation.phoneInvalid');
    }
    return null;
  }

  if (inputType === 'email') {
    if (!trimmed) return i18n.t('validation.emailRequired');
    if (!EMAIL_REGEX.test(trimmed)) return i18n.t('validation.emailInvalid');
    return null;
  }

  if (!trimmed) return i18n.t('validation.usernameRequired');
  if (trimmed.length < 2 || trimmed.length > 20) return i18n.t('validation.usernameInvalid');
  return null;
}

export function validateLoginPassword(value: string): string | null {
  if (!value) return i18n.t('validation.passwordRequired');
  return null;
}

export function validateCode(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return i18n.t('validation.codeRequired');
  if (!/^\d{6}$/.test(trimmed)) return i18n.t('validation.codeInvalid');
  return null;
}
