export type RecordType = 'moment';
export type RecordSource = 'USER' | 'SYSTEM' | 'AI';

export interface MomentContent {
  text: string;
  emoji: string;
  media_ids: number[];
}

export type LocationSource = 'GPS' | 'NETWORK' | 'MANUAL' | 'PHOTO_EXIF';

export interface MomentLocation {
  longitude: number;
  latitude: number;
  source: LocationSource;
  accuracy_meters?: number;
  altitude?: number;
  altitude_accuracy_meters?: number;
  captured_at: string;
  address?: string;
  country_code?: string;
  admin_area?: string;
  city?: string;
  district?: string;
}

export interface MomentTag {
  id: string;
  name: string;
  source: RecordSource;
}

export interface MomentRecord {
  record_id: string;
  type: RecordType;
  subtype: string;
  source: RecordSource;
  content: MomentContent;
  location?: MomentLocation;
  tags: MomentTag[];
  recorded_at: string;
  created_at: string;
  updated_at: string;
}
