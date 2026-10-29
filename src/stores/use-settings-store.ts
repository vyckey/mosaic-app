import { create } from 'zustand';

export type ThemeMode = 'system' | 'light' | 'dark';
export type FontSizePreference = 'small' | 'standard' | 'large';
export type TimeFormat = '12h' | '24h';
export type DateFormat = 'ymd' | 'slash' | 'mdy';
export type WeekStart = 'monday' | 'sunday';

export type ReminderDays = 'daily' | 'weekdays' | 'weekend';
export type LifeEventAdvance = 'sameDay' | 'oneDay' | 'threeDays' | 'oneWeek';
export type NotificationPrivacyLevel = 'full' | 'title' | 'hidden';

export type MediaQuality = 'high' | 'standard' | 'original';
export type DefaultRecordTime = 'now' | 'last';
export type VoiceLanguage = 'auto' | 'zh-CN' | 'en';
export type SyncNetwork = 'wifi' | 'any';
export type AutoLockDelay = 'immediately' | '1m' | '5m' | '15m';

export interface AppearanceSettings {
  themeMode: ThemeMode;
  fontSize: FontSizePreference;
  timeFormat: TimeFormat;
  dateFormat: DateFormat;
  weekStart: WeekStart;
}

export interface NotificationSettings {
  dailyQuestion: {
    enabled: boolean;
    time: string;
    days: ReminderDays;
  };
  onThisDay: {
    enabled: boolean;
    time: string;
    days: ReminderDays;
  };
  lifeEvents: {
    enabled: boolean;
    advance: LifeEventAdvance;
  };
  others: {
    aiInsight: boolean;
    goals: boolean;
    habits: boolean;
    announcements: boolean;
  };
  dnd: {
    enabled: boolean;
    start: string;
    end: string;
    allowImportant: boolean;
  };
  privacy: {
    level: NotificationPrivacyLevel;
    hideContent: boolean;
    hideAiInsight: boolean;
  };
}

export interface RecordPreferences {
  defaults: {
    autoSaveDraft: boolean;
    defaultTag: string;
    recordTime: DefaultRecordTime;
    defaultMood: string;
  };
  autoInfo: {
    location: boolean;
    weather: boolean;
    time: boolean;
  };
  media: {
    quality: MediaQuality;
    keepOriginal: boolean;
    useExifTime: boolean;
  };
  voice: {
    transcribe: boolean;
    language: VoiceLanguage;
    keepAudio: boolean;
    autoSummary: boolean;
  };
  privacy: {
    statistics: boolean;
    aiAnalysis: boolean;
    portrait: boolean;
    lifeStory: boolean;
  };
}

export interface AiSettings {
  features: {
    chat: boolean;
    insight: boolean;
    portrait: boolean;
    story: boolean;
    proactive: boolean;
  };
  dataUsage: {
    moments: boolean;
    mood: boolean;
    health: boolean;
    travel: boolean;
    relationship: boolean;
    reading: boolean;
    lifeEvents: boolean;
    /** One-off permission scoped to the current chat only */
    temporary: boolean;
  };
}

export interface SecuritySettings {
  appLock: {
    enabled: boolean;
    autoLock: AutoLockDelay;
    passcodeFallback: boolean;
    unlockOnReturn: boolean;
    maskSwitcher: boolean;
  };
}

export interface SourceSettings {
  weather: {
    connected: boolean;
    autoSync: boolean;
  };
  connections: {
    health: boolean;
    location: boolean;
    music: boolean;
    reading: boolean;
  };
  autoSync: {
    network: SyncNetwork;
    background: boolean;
    retry: boolean;
  };
}

export interface SettingsSections {
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  records: RecordPreferences;
  ai: AiSettings;
  security: SecuritySettings;
  sources: SourceSettings;
}

export interface SettingsState extends SettingsSections {
  setAppearance: (patch: Partial<AppearanceSettings>) => void;
  setNotifications: (patch: Partial<NotificationSettings>) => void;
  setRecords: (patch: Partial<RecordPreferences>) => void;
  setAi: (patch: Partial<AiSettings>) => void;
  setSecurity: (patch: Partial<SecuritySettings>) => void;
  setSources: (patch: Partial<SourceSettings>) => void;
  resetSettings: () => void;
}

const initialSections: SettingsSections = {
  appearance: {
    themeMode: 'system',
    fontSize: 'standard',
    timeFormat: '24h',
    dateFormat: 'ymd',
    weekStart: 'monday',
  },
  notifications: {
    dailyQuestion: { enabled: true, time: '21:00', days: 'daily' },
    onThisDay: { enabled: true, time: '09:00', days: 'daily' },
    lifeEvents: { enabled: true, advance: 'oneDay' },
    others: {
      aiInsight: true,
      goals: true,
      habits: false,
      announcements: true,
    },
    dnd: { enabled: false, start: '22:00', end: '08:00', allowImportant: true },
    privacy: { level: 'full', hideContent: false, hideAiInsight: false },
  },
  records: {
    defaults: {
      autoSaveDraft: true,
      defaultTag: 'life',
      recordTime: 'now',
      defaultMood: 'none',
    },
    autoInfo: { location: true, weather: true, time: true },
    media: { quality: 'high', keepOriginal: false, useExifTime: true },
    voice: {
      transcribe: true,
      language: 'auto',
      keepAudio: false,
      autoSummary: true,
    },
    privacy: {
      statistics: true,
      aiAnalysis: true,
      portrait: true,
      lifeStory: false,
    },
  },
  ai: {
    features: {
      chat: true,
      insight: true,
      portrait: true,
      story: true,
      proactive: true,
    },
    dataUsage: {
      moments: true,
      mood: true,
      health: true,
      travel: true,
      relationship: false,
      reading: false,
      lifeEvents: true,
      temporary: false,
    },
  },
  security: {
    appLock: {
      enabled: false,
      autoLock: 'immediately',
      passcodeFallback: true,
      unlockOnReturn: true,
      maskSwitcher: true,
    },
  },
  sources: {
    weather: { connected: true, autoSync: true },
    connections: { health: false, location: true, music: false, reading: false },
    autoSync: { network: 'wifi', background: true, retry: true },
  },
};

/**
 * Global settings preferences.
 *
 * Section setters take a shallow patch, so nested objects stay explicit at the
 * call site (`setNotifications({ dnd: { ...dnd, enabled: next } })`). Keeping
 * the whole config in one store lets every settings page and the theme/i18n
 * layers subscribe to the same source of truth.
 */
export const useSettingsStore = create<SettingsState>((set) => ({
  ...initialSections,
  setAppearance: (patch) =>
    set((state) => ({ appearance: { ...state.appearance, ...patch } })),
  setNotifications: (patch) =>
    set((state) => ({ notifications: { ...state.notifications, ...patch } })),
  setRecords: (patch) =>
    set((state) => ({ records: { ...state.records, ...patch } })),
  setAi: (patch) => set((state) => ({ ai: { ...state.ai, ...patch } })),
  setSecurity: (patch) =>
    set((state) => ({ security: { ...state.security, ...patch } })),
  setSources: (patch) =>
    set((state) => ({ sources: { ...state.sources, ...patch } })),
  resetSettings: () => set(initialSections),
}));

/** Number of truthy flags in a record — used for "3/4 enabled" summaries. */
export function countEnabled(flags: Record<string, boolean>): number {
  return Object.values(flags).filter(Boolean).length;
}
