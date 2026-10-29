import { useCallback, useState } from 'react';

const DEFAULT_ALL_TAGS = [
  '产品',
  '设计',
  '前端',
  '后端',
  '测试',
  '运营',
  'AI',
  'React',
  '交互',
  '增长',
  '数据',
  '架构',
  '面试',
  '读书',
  '运动',
  '旅行',
];

const DEFAULT_RECENT_TAGS = ['产品', '设计', '前端', 'AI', 'React'];

const POPULAR_TAGS = ['设计', '产品', 'AI', '数据', '前端', '架构', '增长', '面试'];

const MAX_RECENT = 8;

export interface TagCatalog {
  all: string[];
  recent: string[];
  popular: string[];
  add: (tag: string) => void;
  touch: (tags: string[]) => void;
}

export function useTagCatalog(): TagCatalog {
  const [all, setAll] = useState(DEFAULT_ALL_TAGS);
  const [recent, setRecent] = useState(DEFAULT_RECENT_TAGS);

  const add = useCallback((tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    setAll((prev) => (prev.includes(trimmed) ? prev : [trimmed, ...prev]));
    setRecent((prev) => [trimmed, ...prev.filter((item) => item !== trimmed)].slice(0, MAX_RECENT));
  }, []);

  const touch = useCallback((tags: string[]) => {
    if (tags.length === 0) return;
    setRecent((prev) =>
      [...tags].reverse().reduce<string[]>(
        (acc, tag) => (acc.includes(tag) ? acc : [...acc, tag]),
        prev.filter((tag) => !tags.includes(tag)),
      ).slice(0, MAX_RECENT),
    );
  }, []);

  return { all, recent, popular: POPULAR_TAGS, add, touch };
}
