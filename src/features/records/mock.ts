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
 * set on the record); the feed row no longer renders it.
 */
const withAuthors = (records: MosaicRecord[]): MosaicRecord[] =>
  records.map((record, index) => ({
    ...record,
    author: record.author ?? mockAuthors[index % mockAuthors.length],
  }));

const baseRecords: MosaicRecord[] = [
  {
    id: 'record-1',
    time: new Date('2026-10-01T01:15:00Z'),
    emoji: '🏃',
    content: '跑步 5km，今天状态很好',
    type: 'moment',
    typeLabel: '运动',
    tags: ['晨跑'],
  },
  {
    id: 'record-2',
    time: new Date('2026-11-01T04:30:00Z'),
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
    time: new Date('2025-11-02T07:00:00Z'),
    emoji: '',
    content: '下午阳光很好，心情不错',
    type: 'mood',
    typeLabel: '心情',
  },
  {
    id: 'record-4',
    time: new Date('2026-10-01T10:40:00Z'),
    emoji: '📚',
    content: '读完《三体》，还是觉得很震撼',
    type: 'moment',
    typeLabel: '阅读',
  },
  {
    id: 'record-5',
    time: new Date('2026-10-01T13:30:00Z'),
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

/**
 * Build a `count`-image media list from the photo pool (ids are unique per
 * call; `offset` shifts the pool so calendar tiles don't repeat the same photo)
 */
const makeMedia = (
  prefix: string,
  count: number,
  offset = 0,
): MomentMedia[] =>
  photoPool.slice(offset, offset + count).map((url, index) => ({
    id: `${prefix}-${index + 1}`,
    kind: 'image',
    url,
  }));

const streamRecords: MosaicRecord[] = [
  {
    id: 'record-0',
    time: new Date('2026-11-02T00:10:00Z'),
    emoji: '☀️',
    content: '早起喝了杯手冲，今天状态不错',
    type: 'mood',
    typeLabel: '心情',
  },
  ...baseRecords.slice(0, 4),
  {
    id: 'record-7',
    time: new Date('2026-10-01T10:42:00Z'),
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
    time: new Date('2026-10-01T15:00:00Z'),
    emoji: '😴',
    content: '早点睡，明天还要跑步',
    type: 'mood',
    typeLabel: '心情',
  },
  {
    id: 'record-8',
    time: new Date('2026-10-01T10:42:00Z'),
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
    time: new Date('2026-10-01T10:42:00Z'),
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
    time: new Date('2026-09-30T23:05:00Z'),
    emoji: '📷',
    content: '早上的第一缕阳光，只拍到一张。',
    type: 'moment',
    typeLabel: '照片',
    media: makeMedia('p1', 1),
    tags: ['清晨'],
  },
  {
    id: 'record-photo-4',
    time: new Date('2026-10-01T03:20:00Z'),
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
    time: new Date('2026-10-01T05:45:00Z'),
    emoji: '🍽️',
    content: '五张图的午餐记录，看看换行是否正常。',
    type: 'moment',
    typeLabel: '美食',
    media: makeMedia('p5', 5),
    tags: ['美食'],
  },
  {
    id: 'record-photo-6',
    time: new Date('2026-10-01T08:30:00Z'),
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
    time: new Date('2026-10-01T11:10:00Z'),
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
    recordedAt: '2026-10-01T10:42:00Z',
  },
  {
    type: 'moment',
    text: '中午和同事吃了新开的拉面。',
    tags: ['美食', '同事'],
    recordedAt: '2026-10-01T04:35:00Z',
  },
  {
    type: 'mood',
    emoji: '😊',
    text: '今天心情特别好',
    tags: ['周末', '好天气'],
    recordedAt: '2026-10-01T13:30:00Z',
  },
  {
    type: 'mood',
    emoji: '😮‍💨',
    recordedAt: '2026-10-02T00:05:00Z',
  },
];

export const mockCategories: RecordsCategory[] = [
  { id: 'mood', emoji: '😊', name: '心情', count: 234, maxCount: 892 },
  { id: 'sport', emoji: '🏃', name: '运动', count: 89, maxCount: 892 },
  { id: 'writing', emoji: '📝', name: '日记', count: 67, maxCount: 892 },
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
    time: new Date('2026-10-01T01:40:00Z'),
    emoji: '',
    content: '第一次去了镰仓，江之电真的和灌篮高手里一模一样',
    type: 'moment',
    typeLabel: '旅行',
  },
  {
    id: 'kamakura-2',
    time: new Date('2026-10-01T02:15:00Z'),
    emoji: '📷',
    content: '江之电',
    type: 'moment',
    typeLabel: '照片',
  },
  {
    id: 'kamakura-3',
    time: new Date('2026-10-01T06:30:00Z'),
    emoji: '📷',
    content: '镰仓大佛',
    type: 'moment',
    typeLabel: '照片',
  },
]);

/** 2026-08 instants stay on the same local day in +08:00 (hour 0-15 UTC) */
const calendarTime = (day: number, hour: number) =>
  new Date(
    `2026-08-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:20:00Z`,
  );

/** Calendar record with photos — feeds the photo wall thumbnail */
const calendarPhotoRecord = (
  id: string,
  day: number,
  hour: number,
  emoji: string,
  content: string,
  photoCount: number,
  offset = 0,
): MosaicRecord => ({
  id: `calendar-${id}`,
  time: calendarTime(day, hour),
  emoji,
  content,
  type: 'moment',
  typeLabel: '瞬间',
  media: makeMedia(`cal-${id}`, photoCount, offset),
});

/** Calendar record without photos — the day keeps its plain date number */
const calendarMoodRecord = (
  id: string,
  day: number,
  hour: number,
  emoji: string,
  content?: string,
): MosaicRecord => ({
  id: `calendar-${id}`,
  time: calendarTime(day, hour),
  emoji,
  content,
  type: 'mood',
  typeLabel: '心情',
});

/**
 * Calendar mock: one month of records keyed by day of month. Days that carry
 * photos show thumbnails on the calendar photo wall; text-only days keep the
 * normal date number.
 */
export const mockCalendarRecords: Record<number, MosaicRecord[]> = {
  2: withAuthors([
    calendarPhotoRecord('2a', 2, 1, '🌅', '清晨的江边，雾还没散', 2, 6),
  ]),
  4: withAuthors([calendarMoodRecord('4a', 4, 12, '😌', '普通但舒服的一天')]),
  5: withAuthors([
    calendarPhotoRecord('5a', 5, 3, '🍜', '同事推荐的拉面店，汤头很浓', 1, 2),
    calendarMoodRecord('5b', 5, 11, '🌙', '吃完散步回家'),
  ]),
  8: withAuthors([
    calendarPhotoRecord('8a', 8, 2, '🌻', '向日葵开得正好', 4, 0),
  ]),
  10: withAuthors([calendarMoodRecord('10a', 10, 13, '😮‍💨', '加班到很晚')]),
  12: withAuthors([
    calendarPhotoRecord('12a', 12, 4, '☕️', '新开的咖啡店', 1, 5),
  ]),
  15: withAuthors([
    calendarPhotoRecord('15a', 15, 6, '🏙️', '周末 city walk', 3, 1),
  ]),
  17: withAuthors([calendarMoodRecord('17a', 17, 9, '📚', '读完一本书')]),
  19: withAuthors([
    calendarPhotoRecord('19a', 19, 5, '🏕️', '露营的傍晚', 6, 0),
  ]),
  21: withAuthors([
    calendarPhotoRecord('21a', 21, 7, '🌇', '晚霞染红了半边天', 9, 0),
  ]),
  23: withAuthors([calendarMoodRecord('23a', 23, 10, '🌧️', '下雨，哪儿也没去')]),
  25: withAuthors([
    calendarPhotoRecord('25a', 25, 2, '🌸', '路边的花开了', 2, 3),
  ]),
  27: withAuthors([
    calendarPhotoRecord('27a', 27, 8, '📷', '随手拍的一张', 1, 7),
  ]),
  30: withAuthors([
    calendarPhotoRecord('30a', 30, 3, '🍻', '和朋友吃饭，聊到很晚', 3, 5),
    calendarMoodRecord('30b', 30, 12, '😴', '回家倒头就睡'),
  ]),
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
