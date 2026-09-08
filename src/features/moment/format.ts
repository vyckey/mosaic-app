const pad2 = (n: number) => String(n).padStart(2, '0');

/** 2026-10-14 09:15 */
export const formatRecordedAt = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;

/** ISO 字符串 → 2026-10-14 09:15 */
export const formatIsoDateTime = (iso: string) =>
  formatRecordedAt(new Date(iso));
