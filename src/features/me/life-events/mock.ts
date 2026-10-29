import type { LifeEvent, LifeEventMoment } from './types';

/** Unsplash thumbnails — prototype stand-ins for locally imported photos */
const photo = (id: string) => `https://images.unsplash.com/${id}?w=600&q=80`;

/** The three linked Moments of the graduation life event (detail page demo) */
const graduationMoments: LifeEventMoment[] = [
  {
    id: 'moment-graduation-ceremony',
    title: '毕业典礼上的合影',
    date: new Date(2020, 5, 10),
  },
  {
    id: 'moment-graduation-dinner',
    title: '和同学一起吃毕业饭',
    date: new Date(2020, 5, 15),
  },
  {
    id: 'moment-graduation-leave',
    title: '正式离开学校',
    date: new Date(2020, 5, 20),
  },
];

/**
 * Prototype life archive: ten lifeEvents.spread over ~28 years so the
 * timeline has real year groups, several categories and mixed date precisions
 * (year / month / day / approximate range).
 */
export const mockLifeEvents: LifeEvent[] = [
  {
    id: 'life-event-new-career',
    title: '开启新的职业生涯',
    description: '加入一家新的公司，开始全新的职业旅程，迎来人生新的阶段。',
    category: 'career',
    date: { precision: 'month', year: 2024, month: 3 },
    importance: 'turningPoint',
    location: '上海',
    stage: 'career',
    photos: [photo('photo-1497366216548-37526070297c')],
    status: 'past',
  },
  {
    id: 'life-event-new-family',
    title: '开启一段新的家庭生活',
    description: '人生进入新的阶段，开始共同经营属于自己的生活。',
    category: 'relationship',
    date: { precision: 'month', year: 2023, month: 9 },
    importance: 'milestone',
    location: '上海',
    stage: 'family',
    photos: [photo('photo-1511895426328-dc8714191300')],
    status: 'past',
  },
  {
    id: 'life-event-move-shanghai',
    title: '搬到上海生活',
    description: '换一座城市，也换一种生活节奏。',
    category: 'migration',
    date: { precision: 'year', year: 2022 },
    location: '上海',
    stage: 'career',
    status: 'past',
  },
  {
    id: 'life-event-gap-year',
    title: '间隔年旅行',
    description: '用一年时间走走停停，重新认识自己。',
    category: 'migration',
    date: { precision: 'range', year: 2021, endYear: 2022 },
    stage: 'exploration',
    photos: [photo('photo-1500530855697-b586d89ba3ee')],
    status: 'past',
  },
  {
    id: 'life-event-first-job',
    title: '第一份工作',
    description: '第一次以“职场人”的身份走进办公室，紧张又兴奋。',
    category: 'career',
    date: { precision: 'month', year: 2020, month: 8 },
    location: '武汉',
    stage: 'career',
    status: 'past',
  },
  {
    id: 'life-event-graduation',
    title: '大学毕业',
    description: '结束四年的大学生活，正式告别校园，开启人生新的篇章。',
    category: 'education',
    date: { precision: 'month', year: 2020, month: 6 },
    importance: 'milestone',
    location: '武汉',
    people: ['室友', '导师'],
    stage: 'school',
    photos: [photo('photo-1523050854058-8df90110c9f1')],
    moments: graduationMoments,
    status: 'past',
  },
  {
    id: 'life-event-university',
    title: '进入大学',
    description: '离开熟悉的环境，开始独立生活与新的学习旅程。',
    category: 'education',
    date: { precision: 'month', year: 2016, month: 9 },
    location: '武汉',
    stage: 'school',
    photos: [photo('photo-1541339907198-e08756dedf3f')],
    status: 'past',
  },
  {
    id: 'life-event-half-marathon',
    title: '完成第一次半程马拉松',
    description: '跑到最后一公里时，才发现自己真的可以。',
    category: 'health',
    date: { precision: 'day', year: 2025, month: 4, day: 13 },
    location: '杭州',
    photos: [photo('photo-1452626038306-9aae5e071dd3')],
    status: 'past',
  },
  {
    id: 'life-event-birth',
    title: '出生',
    description: '来到这个世界，人生故事从这里开始。',
    category: 'family',
    date: { precision: 'month', year: 1998, month: 5 },
    location: '长沙',
    stage: 'childhood',
    status: 'past',
  },
  {
    id: 'life-event-film-photography',
    title: '开始学习胶片摄影',
    description: '用一台旧相机记录生活，把时间留在底片上。',
    category: 'achievement',
    date: { precision: 'year', year: 2026 },
    stage: 'exploration',
    photos: [photo('photo-1452780212940-6f5c0d14d848')],
    status: 'ongoing',
  },
];

/** Look up one life event by id (detail / edit routes) */
export function findLifeEvent(id: string): LifeEvent | undefined {
  return mockLifeEvents.find((event) => event.id === id);
}
