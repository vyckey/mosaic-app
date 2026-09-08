import {
  getCountryByCca2,
  getCountryByPhoneNumber,
  type ICountry,
} from 'rn-international-phone-number';

/** 未携带国际区号时的默认国家（中国大陆） */
export const DEFAULT_PHONE_CCA2 = 'CN';

/** 拨打区号，如 '+86'（圣赫勒拿等 root+suffix 结构也能正确拼出） */
function getDialCode(country: ICountry): string {
  return `${country.idd.root}${country.idd.suffixes[0] ?? ''}`;
}

/** 本地号码 + 国家 → E.164 国际号码（如 '+8613800000000'）；号码为空时返回空串 */
export function composeE164(nationalPhoneNumber: string, country: ICountry | null): string {
  const digits = nationalPhoneNumber.replace(/\D/g, '');
  if (!digits) return '';
  if (!country) return digits;
  return `${getDialCode(country)}${digits}`;
}

/** 根据账号值推断国家：'+861…' 走国际号码解析，其余回落默认国家 */
export function resolveCountry(account: string): ICountry | null {
  const trimmed = account.trim();
  const fromNumber = trimmed.startsWith('+') ? getCountryByPhoneNumber(trimmed) : undefined;
  return fromNumber ?? getCountryByCca2(DEFAULT_PHONE_CCA2) ?? null;
}
