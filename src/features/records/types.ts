export type RecordsView = 'stream' | 'calendar' | 'map' | 'category';

/**
 * Discriminated union over record types: `type` is the machine key driving
 * body rendering (see RecordEntryBody), `typeLabel` is the human-facing
 * category shown in the header (kept as a raw string for prototype speed;
 * derive it from `type` when i18n lands).
 */
export type MosaicRecord = MosaicMoodRecord | MosaicMomentRecord;

/** Fields every record type shares (rendered by the RecordEntry skeleton) */
export interface MosaicRecordBase {
  id: string;
  /** Display timestamp, formatted `yyyy-MM-dd HH:mm` (mock already pre-formatted) */
  time: string;
  /** Optional author shown as avatar + name on the row (Moments style) */
  author?: RecordsAuthor;
  tags?: string[];
  location?: MomentLocation;
  emoji?: string;
}

/** Mood record: short/no body text; header keeps the small emoji */
export interface MosaicMoodRecord extends MosaicRecordBase {
  type: 'mood';
  typeLabel: string;
  content?: string;
  emoji: string;
}

/** Moment record: body text plus an optional photo grid */
export interface MosaicMomentRecord extends MosaicRecordBase {
  type: 'moment';
  typeLabel: string;
  content: string;
  media?: MomentMedia[];
}

/** Row author; `avatarUri` empty/absent falls back to a generic user icon */
export interface RecordsAuthor {
  name: string;
  avatarUri?: string;
}

export interface MomentMedia {
  id: string;
  kind: 'image' | 'video';
  url: string;
}

export interface MomentLocation {
  name: string;
  address?: string;
  source: 'gps' | 'manual' | 'photo_exif';
}

export interface MomentRecord {
  type: 'moment';
  text?: string;
  media?: MomentMedia[];
  tags?: string[];
  location?: MomentLocation;
  recordedAt: string;
}

export interface MoodRecord {
  type: 'mood';
  emoji: string;
  text?: string;
  tags?: string[];
  recordedAt: string;
}

export type RecordSample = MomentRecord | MoodRecord;

export interface RecordsCategory {
  id: string;
  emoji: string;
  name: string;
  count: number;
  maxCount: number;
}

export interface RecordsLocation {
  id: string;
  name: string;
  count: number;
  left: `${number}%`;
  top: `${number}%`;
}

export interface RecordsMapData {
  cities: number;
  countries: number;
  footprints: number;
  locations: RecordsLocation[];
  featuredLocationId: string;
}
