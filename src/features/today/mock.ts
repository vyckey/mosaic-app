import type { TodayData } from './types';

export const mockToday: TodayData = {
  date: '8月30日',
  weekday: '周六',

  weather: {
    temperature: 24,
    condition: 'sunny',
  },

  memoryOfToday: {
    id: 'memory-2025-08-30',
    date: '2025年8月30日',
    author: {
      name: '我',
    },
    content:
      '去年今天去了趟海边。天气很好，坐在沙滩上看了很久的海，傍晚的时候还看到了一场很漂亮的日落。',
    image: {
      uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    },
    likes: 12,
    comments: 3,
  },

  fragments: [
    {
      id: 'fragment-1',
      time: '10:32',
      type: 'text',
      content: '今天早上去了趟咖啡店，看了一会儿书。',
    },
    {
      id: 'fragment-2',
      time: '15:18',
      type: 'photo',
      content: '午后在湖边散了会步。',
    },
    {
      id: 'fragment-3',
      time: '18:42',
      type: 'voice',
      content: '录了一段关于今天的语音。',
    },
    {
      id: 'fragment-4',
      time: '20:16',
      type: 'link',
      content: '收藏了一个今天很喜欢的设计。',
    },
  ],

  dailyQuestion: {
    id: 'question-1',
    question: '今天最开心的一件事是什么？',
  },
};
