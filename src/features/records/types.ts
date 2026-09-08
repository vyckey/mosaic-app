export type RecordsView = 'stream' | 'calendar' | 'map' | 'category';

export interface RecordsFragment {
  id: string;
  time: string;
  content: string;
  emoji: string;
  type: string;
  media?: MomentMedia[];
  tags?: string[];
  location?: MomentLocation;
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
