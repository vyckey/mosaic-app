import type { LucideIcon } from 'lucide-react-native';

/**
 * Category ids of a life event. Keep this union in sync with the i18n labels
 * (`lifeEvents.categories.*`) and the mock timeline.
 */
export type LifeEventCategoryId =
  | 'family'
  | 'education'
  | 'career'
  | 'relationship'
  | 'health'
  | 'migration'
  | 'achievement'
  | 'other';

export interface LifeEventCategory {
  id: LifeEventCategoryId;
  /** i18n key under `lifeEvents.categories` */
  labelKey: string;
  icon: LucideIcon;
}

/**
 * How precise the recorded date is. The timeline never fabricates a day the
 * user doesn't know: `year` / `month` / `range` simply render less detail.
 */
export type LifeEventDatePrecision = 'year' | 'month' | 'day' | 'range';

export interface LifeEventDate {
  precision: LifeEventDatePrecision;
  year: number;
  /** 1-12; only for `month` and `day` precision */
  month?: number;
  /** 1-31; only for `day` precision */
  day?: number;
  /** End year of an approximate period; only for `range` precision */
  endYear?: number;
}

/** Optional importance hint rendered next to the date */
export type LifeEventImportance = 'turningPoint' | 'milestone';

/**
 * Coarse life stage a life event belongs to. It is not shown on the timeline
 * (the year is the visual anchor) — it only powers the “Life stages” metric.
 */
export type LifeEventStage =
  | 'childhood'
  | 'school'
  | 'career'
  | 'family'
  | 'exploration';

export type LifeEventStatus = 'past' | 'ongoing';

/** A linked Moment record (the “相关生活碎片” section of the detail page) */
export interface LifeEventMoment {
  id: string;
  title: string;
  date: Date;
}

export interface LifeEvent {
  id: string;
  title: string;
  description?: string;
  category: LifeEventCategoryId;
  date: LifeEventDate;
  importance?: LifeEventImportance;
  location?: string;
  people?: string[];
  /** Image uris; the first one is the timeline thumbnail */
  photos?: string[];
  status: LifeEventStatus;
  stage?: LifeEventStage;
  moments?: LifeEventMoment[];
}

/** Aggregated numbers for the page overview */
export interface LifeEventStats {
  events: number;
  stages: number;
  /** Years since the earliest recorded life event */
  years: number;
}
