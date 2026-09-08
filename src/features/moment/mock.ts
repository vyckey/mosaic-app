import type { MomentRecord } from './types';

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
