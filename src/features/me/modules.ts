import {
  BookOpen,
  Fingerprint,
  Milestone,
  Puzzle,
  type LucideIcon,
} from 'lucide-react-native';

/** Entry keys of the self-discovery modules on the Me page */
export type MeModuleKey = 'portrait' | 'life-events' | 'report' | 'story';

export interface MeModule {
  key: MeModuleKey;
  icon: LucideIcon;
  /** i18n key of the module label */
  labelKey: string;
}

/**
 * Self-discovery modules shown as a 2x2 grid under the avatar. Each entry has
 * its own second-level page (`/me/<key>`).
 */
export const meModules: MeModule[] = [
  { key: 'portrait', icon: Fingerprint, labelKey: 'me.modules.portrait' },
  { key: 'life-events', icon: Milestone, labelKey: 'me.modules.lifeEvents' },
  { key: 'report', icon: Puzzle, labelKey: 'me.modules.report' },
  { key: 'story', icon: BookOpen, labelKey: 'me.modules.story' },
];
