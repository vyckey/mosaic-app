import {
  Briefcase,
  GraduationCap,
  Heart,
  HeartPulse,
  Home,
  Plane,
  Sparkles,
  Trophy,
} from 'lucide-react-native';

import type { LifeEventCategory, LifeEventCategoryId } from './types';

/**
 * Timeline filter categories, in display order. `all` is a virtual option the
 * page adds itself, so it is intentionally absent here.
 */
export const lifeEventCategories: LifeEventCategory[] = [
  { id: 'family', labelKey: 'lifeEvents.categories.family', icon: Home },
  {
    id: 'education',
    labelKey: 'lifeEvents.categories.education',
    icon: GraduationCap,
  },
  { id: 'career', labelKey: 'lifeEvents.categories.career', icon: Briefcase },
  {
    id: 'relationship',
    labelKey: 'lifeEvents.categories.relationship',
    icon: Heart,
  },
  { id: 'health', labelKey: 'lifeEvents.categories.health', icon: HeartPulse },
  { id: 'migration', labelKey: 'lifeEvents.categories.migration', icon: Plane },
  {
    id: 'achievement',
    labelKey: 'lifeEvents.categories.achievement',
    icon: Trophy,
  },
  { id: 'other', labelKey: 'lifeEvents.categories.other', icon: Sparkles },
];

const categoryById = new Map<LifeEventCategoryId, LifeEventCategory>(
  lifeEventCategories.map((category) => [category.id, category]),
);

/** Look up a category, falling back to “Other” for unknown ids */
export function getLifeEventCategory(
  id: LifeEventCategoryId,
): LifeEventCategory {
  return (
    categoryById.get(id) ?? lifeEventCategories[lifeEventCategories.length - 1]
  );
}

/** Category label resolver (keeps screens free of icon/label plumbing) */
export function lifeEventCategoryLabel(
  id: LifeEventCategoryId,
  t: (key: string) => string,
): string {
  return t(getLifeEventCategory(id).labelKey);
}
