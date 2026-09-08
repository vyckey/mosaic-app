import type {
  MomentMedia,
  RecordSample,
  RecordsCategory,
  RecordsFragment,
  RecordsMapData,
} from './types';

const baseFragments: RecordsFragment[] = [
  {
    id: 'fragment-1',
    time: '09:15',
    emoji: '🏃',
    content: '跑步 5km，今天状态很好',
    type: '运动',
    tags: ['晨跑'],
  },
  {
    id: 'fragment-2',
    time: '12:30',
    emoji: '🍜',
    content: '和同事吃了拉面，新开的那家终于不用排队了',
    type: '美食',
    tags: ['美食', '同事'],
    location: {
      name: '融科橄榄城',
      source: 'gps',
    },
  },
  {
    id: 'fragment-3',
    time: '15:00',
    emoji: '',
    content: '下午阳光很好，心情不错',
    type: '心情',
  },
  {
    id: 'fragment-4',
    time: '18:40',
    emoji: '📚',
    content: '读完《三体》，还是觉得很震撼',
    type: '阅读',
  },
  {
    id: 'fragment-5',
    time: '21:30',
    emoji: '📝',
    content: '和小明聊了很久，他准备换工作了',
    type: '关系',
  },
];

const sunsetMedia: MomentMedia[] = [
  {
    id: 'media-01',
    kind: 'image',
    url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&q=80',
  },
  {
    id: 'media-02',
    kind: 'image',
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&q=80',
  },
];

export const mockRecordsFragments: RecordsFragment[] = [
  {
    id: 'fragment-0',
    time: '08:10',
    emoji: '☀️',
    content: '早起喝了杯手冲，今天状态不错',
    type: '心情',
  },
  ...baseFragments.slice(0, 4),
  {
    id: 'fragment-7',
    time: '18:42',
    emoji: '🌅',
    content: '今天下班的时候看到特别漂亮的晚霞，随手拍了两张。',
    type: '瞬间',
    media: sunsetMedia,
    tags: ['日落', '随手拍'],
    location: {
      name: '望京 SOHO',
      address: '北京市朝阳区望京街 10 号',
      source: 'gps',
    },
  },
  ...baseFragments.slice(4),
  {
    id: 'fragment-6',
    time: '23:00',
    emoji: '😴',
    content: '早点睡，明天还要跑步',
    type: '心情',
  },
];

export const mockRecords: RecordSample[] = [
  {
    type: 'moment',
    text: '今天下班的时候看到特别漂亮的晚霞，随手拍了两张。',
    media: sunsetMedia,
    tags: ['日落', '随手拍'],
    location: {
      name: '望京 SOHO',
      address: '北京市朝阳区望京街 10 号',
      source: 'gps',
    },
    recordedAt: '2026-10-01T18:42:00+08:00',
  },
  {
    type: 'moment',
    text: '中午和同事吃了新开的拉面。',
    tags: ['美食', '同事'],
    recordedAt: '2026-10-01T12:35:00+08:00',
  },
  {
    type: 'mood',
    emoji: '😊',
    text: '今天心情特别好',
    tags: ['周末', '好天气'],
    recordedAt: '2026-10-01T21:30:00+08:00',
  },
  {
    type: 'mood',
    emoji: '😮‍💨',
    recordedAt: '2026-10-02T08:05:00+08:00',
  },
];

export const mockCategories: RecordsCategory[] = [
  { id: 'mood', emoji: '😊', name: '心情', count: 234, maxCount: 892 },
  { id: 'sport', emoji: '🏃', name: '运动', count: 89, maxCount: 892 },
  { id: 'diary', emoji: '📝', name: '日记', count: 67, maxCount: 892 },
  { id: 'photo', emoji: '📷', name: '照片', count: 892, maxCount: 892 },
  { id: 'read', emoji: '', name: '阅读', count: 45, maxCount: 892 },
  { id: 'relation', emoji: '👥', name: '关系', count: 156, maxCount: 892 },
  { id: 'travel', emoji: '✈️', name: '旅行', count: 34, maxCount: 892 },
  { id: 'food', emoji: '🍜', name: '美食', count: 78, maxCount: 892 },
];

export const mockMapData: RecordsMapData = {
  cities: 6,
  countries: 3,
  footprints: 892,
  locations: [
    { id: 'beijing', name: '北京', count: 156, left: '25%', top: '40%' },
    { id: 'tokyo', name: '东京', count: 12, left: '65%', top: '28%' },
    { id: 'shanghai', name: '上海', count: 23, left: '50%', top: '65%' },
    { id: 'kamakura', name: '镰仓', count: 3, left: '72%', top: '70%' },
    { id: 'hangzhou', name: '杭州', count: 8, left: '18%', top: '72%' },
  ],
  featuredLocationId: 'kamakura',
};

export const mockFeaturedLocationFragments: RecordsFragment[] = [
  {
    id: 'kamakura-1',
    time: '09:40',
    emoji: '',
    content: '第一次去了镰仓，江之电真的和灌篮高手里一模一样',
    type: '旅行',
  },
  {
    id: 'kamakura-2',
    time: '10:15',
    emoji: '📷',
    content: '江之电',
    type: '照片',
  },
  {
    id: 'kamakura-3',
    time: '14:30',
    emoji: '📷',
    content: '镰仓大佛',
    type: '照片',
  },
];

export const mockCalendarRecords: Record<number, RecordsFragment[]> = {
  28: baseFragments.slice(0, 2),
  29: baseFragments.slice(3, 5),
  30: baseFragments.slice(0, 3),
};

export const currentMonth = {
  year: 2026,
  month: 8,
  label: '2026年8月',
  days: 31,
  firstWeekday: 5, // 2026-08-01 is Saturday (0=Mon ... 6=Sun for prototype)
};
