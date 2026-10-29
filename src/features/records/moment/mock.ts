import { mockMosaicRecords } from '../mock';
import type { MosaicMomentRecord } from '../types';
import type { LocationSource, MomentRecord } from './types';

/** 展示页顶部的用户信息（后续由登录态/接口注入） */
export interface MomentUser {
  name: string;
  avatarUri?: string;
}

export const mockMomentUser: MomentUser = {
  name: '林小满',
};

/** 展示页的媒体资源：record.content.media_ids → 可直接渲染的地址 */
export const mockMomentMediaUris: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&q=80',
  2: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&q=80',
};

export const mockMomentRecord: MomentRecord = {
  record_id: 'moment-mock-1',
  type: 'moment',
  subtype: 'moment',
  source: 'USER',
  content: {
    text: '今天下班的时候看到特别漂亮的晚霞，随手拍了两张。感觉一整天的疲惫都被治愈了，希望明天也能有这样的好天气。',
    emoji: '😁',
    media_ids: [1, 2],
  },
  location: {
    longitude: 116.4802,
    latitude: 39.9985,
    source: 'GPS',
    accuracy_meters: 12,
    captured_at: '2026-10-14T18:42:00+08:00',
    address: '北京市朝阳区望京街 10 号',
    country_code: 'CN',
    admin_area: '北京市',
    city: '北京市',
    district: '朝阳区',
  },
  tags: [
    { id: '1', name: '日落', source: 'USER' },
    { id: '2', name: '随手拍', source: 'USER' },
  ],
  recorded_at: '2026-10-14T18:42:00+08:00',
  created_at: '2026-10-14T18:43:10+08:00',
  updated_at: '2026-10-14T18:43:10+08:00',
};

/**
 * Prototype media store shared by every mock moment. The detail page only
 * knows `media_ids`, so feed records register their URLs here while the module
 * loads and the screen looks them up through `getMomentMediaUris`.
 */
const momentMediaUris: Record<number, string> = { ...mockMomentMediaUris };

/** Feed media ids start here so they never collide with the detail mock's 1/2. */
let nextFeedMediaId = 1000;

const registerMedia = (url: string): number => {
  const id = nextFeedMediaId;
  nextFeedMediaId += 1;
  momentMediaUris[id] = url;
  return id;
};

/** Feed location source (lowercase) → API-shaped location source */
const toLocationSource = (
  source: NonNullable<MosaicMomentRecord['location']>['source'],
): LocationSource => {
  switch (source) {
    case 'gps':
      return 'GPS';
    case 'photo_exif':
      return 'PHOTO_EXIF';
    case 'manual':
      return 'MANUAL';
  }
};

/**
 * Adapts a feed row to the detail page's API-shaped record, so any moment
 * opened from the stream can be found by its `record.id` too.
 */
const toMomentRecord = (record: MosaicMomentRecord): MomentRecord => {
  const recordedAt = record.time.toISOString();

  return {
    record_id: record.id,
    type: 'moment',
    subtype: record.typeLabel,
    source: 'USER',
    content: {
      text: record.content,
      emoji: record.emoji ?? '',
      media_ids: (record.media ?? []).map((media) =>
        registerMedia(media.url),
      ),
    },
    location: record.location
      ? {
          longitude: 0,
          latitude: 0,
          source: toLocationSource(record.location.source),
          captured_at: recordedAt,
          address: record.location.address ?? record.location.name,
        }
      : undefined,
    tags: (record.tags ?? []).map((name, index) => ({
      id: `${record.id}-tag-${index}`,
      name,
      source: 'USER',
    })),
    recorded_at: recordedAt,
    created_at: recordedAt,
    updated_at: recordedAt,
  };
};

const feedMomentRecords: MomentRecord[] = mockMosaicRecords
  .filter((record): record is MosaicMomentRecord => record.type === 'moment')
  .map(toMomentRecord);

/** In-memory store for the prototype; replace with the repository/API later. */
export const mockMomentRecords: MomentRecord[] = [
  mockMomentRecord,
  ...feedMomentRecords,
];

/** Looks up a moment by its id; returns `undefined` for an unknown route id. */
export function findMomentRecord(recordId: string): MomentRecord | undefined {
  return mockMomentRecords.find((record) => record.record_id === recordId);
}

/** Resolves just the media referenced by one record (id → renderable url). */
export function getMomentMediaUris(
  record: MomentRecord,
): Record<number, string> {
  const uris: Record<number, string> = {};

  for (const id of record.content.media_ids) {
    const uri = momentMediaUris[id];
    if (uri) uris[id] = uri;
  }

  return uris;
}
