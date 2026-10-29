import { create } from 'zustand';

export interface DataState {
  /** Local cache size in MB (cleared without touching cloud records) */
  cacheMb: number;
  /** Human-readable timestamp of the last successful backup */
  lastBackupAt: string;
  /** Human-readable timestamp of the last generated export */
  exportedAt: string;
  clearCache: () => void;
  markBackedUp: (time?: string) => void;
  markExported: (time?: string) => void;
  reset: () => void;
}

/** `YYYY-MM-DD HH:mm` stamp for freshly completed local actions. */
export function formatNow(date: Date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const initialData = {
  cacheMb: 240,
  lastBackupAt: '2026-11-15 09:00',
  exportedAt: '',
};

/** Local data-management bookkeeping used by the storage/export/backup pages. */
export const useDataStore = create<DataState>((set) => ({
  ...initialData,
  clearCache: () => set({ cacheMb: 0 }),
  markBackedUp: (time = formatNow()) => set({ lastBackupAt: time }),
  markExported: (time = formatNow()) => set({ exportedAt: time }),
  reset: () => set(initialData),
}));
