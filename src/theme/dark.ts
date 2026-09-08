import { colors } from '@/design/colors';

import { radius } from './radius';
import { spacing } from './spacing';
import type { Theme } from './types';
import { typography } from './typography';

/**
 * Dark theme — 深林绿版本，保持鼠尾草色相。
 */
export const darkTheme: Theme = {
  colors: {
    background: colors.moss[950],
    backgroundMuted: colors.sage[950],
    backgroundSubtle: colors.moss[900],

    surface: colors.moss[900],
    surfaceMuted: colors.sage[900],

    text: colors.moss[50],
    textMuted: colors.moss[500],
    textSubtle: colors.moss[600],
    textDisabled: colors.moss[700],

    primary: colors.sage[300],
    primaryForeground: colors.moss[950],
    primaryMuted: colors.sage[900],
    primaryMutedForeground: colors.sage[200],
    primarySoft: colors.sage[700],
    primaryStrong: colors.sage[200],

    secondary: colors.sage[900],
    secondaryForeground: colors.moss[100],

    border: colors.sage[800],
    borderMuted: colors.sage[900],
    borderStrong: colors.moss[700],

    focus: colors.sage[300],

    success: colors.sage[300],
    successForeground: colors.moss[950],
    successMuted: colors.sage[900],
    successMutedForeground: colors.sage[200],

    warning: colors.clay[300],
    warningForeground: colors.moss[950],
    warningMuted: colors.clay[900],
    warningMutedForeground: colors.clay[200],

    danger: colors.rose[400],
    dangerForeground: colors.moss[950],
    dangerMuted: colors.rose[900],
    dangerMutedForeground: colors.rose[200],

    info: colors.sky[400],
    infoForeground: colors.moss[950],
    infoMuted: colors.sky[900],
    infoMutedForeground: colors.sky[200],

    accentLav: colors.lavender[400],
    accentLavMuted: colors.lavender[900],
    accentClay: colors.clay[300],
    accentClayMuted: colors.clay[900],
  },

  radius,
  typography,
  spacing,

  shadows: {
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.35,
      shadowRadius: 28,
      elevation: 4,
    },
    popover: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
      elevation: 8,
    },
    fab: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 20,
      elevation: 8,
    },
    sheet: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
      elevation: 16,
    },
  },
};
