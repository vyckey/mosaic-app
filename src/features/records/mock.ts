import type {
  MomentMedia,
  RecordSample,
  RecordsAuthor,
  RecordsCategory,
  MosaicRecord,
  RecordsMapData,
} from './types';

/**
 * Mock authors for feed rows (prototype stand-ins for real accounts).
 * The last one has no avatar to exercise the User-icon fallback.
 */
const mockAuthors: RecordsAuthor[] = [
  {
    name: '林小满',
    avatarUri:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  },
  {
    name: '阿岚',
    avatarUri:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    name: '周野',
    avatarUri:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  },
  { name: 'Mia' },
];

/**
 * Round-robin attach a mock author to each record (keeps an author already
 * set on the record) so every row shows avatar + username.
 */
const withAuthors = (records: MosaicRecord[]): MosaicRecord[] =>
  records.map((record, index) => ({
    ...record,
    author: record.author ?? mockAuthors[index % mockAuthors.length],
  }));

const baseRecords: MosaicRecord[] = [
  {
    id: 'record-1',
    time: '2026-10-01 09:15',
    emoji: '🏃',
    content: '跑步 5km，今天状态很好',
    type: 'moment',
    typeLabel: '运动',
    tags: ['晨跑'],
  },
  {
    id: 'record-2',
    time: '2026-10-01 12:30',
    emoji: '🍜',
    content: '和同事吃了拉面，新开的那家终于不用排队了',
    type: 'moment',
    typeLabel: '美食',
    tags: ['美食', '同事'],
    location: {
      name: '融科橄榄城',
      source: 'gps',
    },
  },
  {
    id: 'record-3',
    time: '2026-10-01 15:00',
    emoji: '',
    content: '下午阳光很好，心情不错',
    type: 'mood',
    typeLabel: '心情',
  },
  {
    id: 'record-4',
    time: '2026-10-01 18:40',
    emoji: '📚',
    content: '读完《三体》，还是觉得很震撼',
    type: 'moment',
    typeLabel: '阅读',
  },
  {
    id: 'record-5',
    time: '2026-10-01 21:30',
    emoji: '📝',
    content: '和小明聊了很久，他准备换工作了',
    type: 'moment',
    typeLabel: '关系',
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

/**
 * Unsplash photo pool used to build media lists of varying lengths, so the
 * stream grid can be eyeballed at 1 / 4 / 5 / 6 / 9 images per record.
 */
const photoPool: string[] = [
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&q=80',
  'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&q=80',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80',
  'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&q=80',
  'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=600&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80',
];

/** Build a `count`-image media list from the photo pool (ids are unique per call) */
const makeMedia = (prefix: string, count: number): MomentMedia[] =>
  photoPool.slice(0, count).map((url, index) => ({
    id: `${prefix}-${index + 1}`,
    kind: 'image',
    url,
  }));

const streamRecords: MosaicRecord[] = [
  {
    id: 'record-0',
    time: '2026-10-01 08:10',
    emoji: '☀️',
    content: '早起喝了杯手冲，今天状态不错',
    type: 'mood',
    typeLabel: '心情',
  },
  ...baseRecords.slice(0, 4),
  {
    id: 'record-7',
    time: '2026-10-01 18:42',
    emoji: '🌅',
    content:
      '今天下班的时候看到特别漂亮的晚霞，随手拍了两张。晚霞好美呀，希望明天也能看到。',
    type: 'moment',
    typeLabel: '瞬间',
    media: sunsetMedia,
    tags: ['日落', '随手拍'],
    location: {
      name: '望京 SOHO',
      address: '北京市朝阳区望京街 10 号',
      source: 'gps',
    },
  },
  ...baseRecords.slice(4),
  {
    id: 'record-6',
    time: '2026-10-01 23:00',
    emoji: '😴',
    content: '早点睡，明天还要跑步',
    type: 'mood',
    typeLabel: '心情',
  },
  {
    id: 'record-8',
    time: '2026-10-01 18:42',
    emoji: '🌅',
    content: '今天下班的时候看到特别漂亮的晚霞，随手拍了两张。',
    type: 'moment',
    typeLabel: '瞬间',
    media: sunsetMedia,
    tags: ['日落', '随手拍'],
    location: {
      name: '望京 SOHO',
      address: '北京市朝阳区望京街 10 号',
      source: 'gps',
    },
  },
  {
    id: 'record-9',
    time: '2026-10-01 18:42',
    emoji: '🌅',
    content: '今天下班的时候看到特别漂亮的晚霞，随手拍了两张。',
    type: 'moment',
    typeLabel: '瞬间',
    media: sunsetMedia,
    tags: ['日落', '随手拍'],
    location: {
      name: '望京 SOHO',
      address: '北京市朝阳区望京街 10 号',
      source: 'gps',
    },
  },
  // Photo-count variety: exercises the media grid at 1 / 4 / 5 / 6 / 9 images
  // (1 → single hero, 4 → 2x2, 5/6 → uneven wrap, 9 → full 3x3 grid)
  {
    id: 'record-photo-1',
    time: '2026-10-01 07:05',
    emoji: '📷',
    content: '早上的第一缕阳光，只拍到一张。',
    type: 'moment',
    typeLabel: '照片',
    media: makeMedia('p1', 1),
    tags: ['清晨'],
  },
  {
    id: 'record-photo-4',
    time: '2026-10-01 11:20',
    emoji: '🌻',
    content: '向日葵花田，凑了四张。',
    type: 'moment',
    typeLabel: '照片',
    media: makeMedia('p4', 4),
    tags: ['花', '周末'],
    location: {
      name: '奥林匹克森林公园',
      source: 'gps',
    },
  },
  {
    id: 'record-photo-5',
    time: '2026-10-01 13:45',
    emoji: '🍽️',
    content: '五张图的午餐记录，看看换行是否正常。',
    type: 'moment',
    typeLabel: '美食',
    media: makeMedia('p5', 5),
    tags: ['美食'],
  },
  {
    id: 'record-photo-6',
    time: '2026-10-01 16:30',
    emoji: '🏙️',
    content: '下午沿着街道走了一圈，随手拍了六张。',
    type: 'moment',
    typeLabel: '瞬间',
    media: makeMedia('p6', 6),
    tags: ['City Walk', '随手拍'],
    location: {
      name: '三里屯',
      address: '北京市朝阳区三里屯路 19 号',
      source: 'manual',
    },
  },
  {
    id: 'record-photo-9',
    time: '2026-10-01 19:10',
    emoji: '🎑',
    content: '九张图的九宫格，考验一下 3x3 排布。',
    type: 'moment',
    typeLabel: '照片',
    media: makeMedia('p9', 9),
    tags: ['九宫格'],
  },
];

export const mockMosaicRecords: MosaicRecord[] = withAuthors(streamRecords);

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

export const mockFeaturedLocationRecords: MosaicRecord[] = withAuthors([
  {
    id: 'kamakura-1',
    time: '2026-10-01 09:40',
    emoji: '',
    content: '第一次去了镰仓，江之电真的和灌篮高手里一模一样',
    type: 'moment',
    typeLabel: '旅行',
  },
  {
    id: 'kamakura-2',
    time: '2026-10-01 10:15',
    emoji: '📷',
    content: '江之电',
    type: 'moment',
    typeLabel: '照片',
  },
  {
    id: 'kamakura-3',
    time: '2026-10-01 14:30',
    emoji: '📷',
    content: '镰仓大佛',
    type: 'moment',
    typeLabel: '照片',
  },
]);

export const mockCalendarRecords: Record<number, MosaicRecord[]> = {
  28: withAuthors(baseRecords.slice(0, 2)),
  29: withAuthors(baseRecords.slice(3, 5)),
  30: withAuthors(baseRecords.slice(0, 3)),
};

export const currentMonth = {
  year: 2026,
  month: 8,
  label: '2026年8月',
  days: 31,
  firstWeekday: 5, // 2026-08-01 is Saturday (0=Mon ... 6=Sun for prototype)
};

/** 搜索页：最近搜索（原型无真实历史，先给占位数据） */
export const mockRecentSearches: string[] = [
  '海边日落',
  '2025 春节',
  '露营装备',
];

/** 搜索页：推荐搜索词 */
export const mockRecommendedSearches: string[] = [
  '旅行',
  '美食',
  '晨跑',
  '咖啡',
  'City Walk',
  '电影',
  '读书',
  '露营',
];
