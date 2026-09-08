import type { TodayData } from './types';

export const mockToday: TodayData = {
  date: '8月30日',
  weekday: '周六',

  weather: {
    condition: 'sunny',
    temperature: 28,
    label: '晴',
    location: '北京朝阳',
  },

  memoryOfToday: {
    id: 'memory-2025-08-30',
    date: '2025.08.30',
    content: '第一次去了镰仓，江之电真的和灌篮高手里一模一样。',
    photos: [
      {
        uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
        label: '🌊 镰仓 · 江之电',
        badge: '❤️ 9',
      },
      {
        uri: 'https://images.unsplash.com/photo-1492571351-7edd92c04e6d?w=400&q=80',
        label: '🍜 镰仓 · 美食',
        badge: '💬 4',
      },
      {
        uri: 'https://images.unsplash.com/photo-1528360983277-13d9b152c6d1?w=400&q=80',
        label: '⛩️ 镰仓大佛',
        badge: ' 2',
      },
    ],
    meta: '📷 3张 · 😊 9/10 · 📍 镰仓',
    previousYear: {
      year: '两年前',
      content: '入职第一天，紧张又期待',
      meta: '😊 7/10 · 📍 北京朝阳',
    },
  },

  fragments: [
    {
      id: 'fragment-1',
      time: '09:15',
      emoji: '🏃',
      content: '跑步 5km，今天状态很好',
      type: '运动',
    },
    {
      id: 'fragment-2',
      time: '12:30',
      emoji: '🍜',
      content: '和同事吃了拉面，新开的那家终于不用排队了',
      type: '美食',
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
  ],

  dailyQuestion: {
    id: 'question-1',
    question: '今天最开心的一件事是什么？',
  },
};
