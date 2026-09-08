import { colors } from '@/design/colors';

import { radius } from './radius';
import { spacing } from './spacing';
import { typography } from './typography';
import type { Theme } from './types';

/**
 * Light theme — 鼠尾草风格（与 docs/mosaic-prototype-v2.html 的 :root 对齐）
 */
export const lightTheme: Theme = {
  colors: {
    background: colors.moss[100], // --bg #f1f4ea
    backgroundMuted: colors.moss[200], // --paper2 #edf1e5
    backgroundSubtle: colors.moss[200],

    surface: colors.moss[50], // --paper #fcfdf8
    surfaceMuted: colors.moss[200],

    text: colors.moss[900], // --ink #2b3329
    textMuted: colors.moss[600], // --muted #7d8779
    textSubtle: colors.moss[500],
    textDisabled: colors.moss[400],

    primary: colors.sage[500], // --sage #74956d
    primaryForeground: colors.white,
    primaryMuted: colors.sage[200], // --sage2 #e1ebd9
    primaryMutedForeground: colors.sage[700],
    primarySoft: colors.sage[300], // --sage3 #b6c9aa
    primaryStrong: colors.sage[600], // --sage-deep #5a7a53

    secondary: colors.sage[100],
    secondaryForeground: colors.moss[900],

    border: colors.moss[300], // --line #dfe5d5
    borderMuted: colors.sage[50],
    borderStrong: colors.moss[400],

    focus: colors.sage[500],

    success: colors.sage[600],
    successForeground: colors.white,
    successMuted: colors.sage[100],
    successMutedForeground: colors.sage[700],

    warning: colors.clay[500],
    warningForeground: colors.white,
    warningMuted: colors.clay[100],
    warningMutedForeground: colors.clay[700],

    danger: colors.rose[500],
    dangerForeground: colors.white,
    dangerMuted: colors.rose[100],
    dangerMutedForeground: colors.rose[700],

    info: colors.sky[500],
    infoForeground: colors.white,
    infoMuted: colors.sky[100],
    infoMutedForeground: colors.sky[700],

    accentLav: colors.lavender[300], // --lav #c2bcd3
    accentLavMuted: colors.lavender[100], // .lav #ece9f3
    accentClay: colors.clay[500], // --clay #c09077
    accentClayMuted: colors.clay[100], // .clay #f2e6dc
  },

  radius,
  typography,
  spacing,

  shadows: {
    card: {
      shadowColor: '#4A5840',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.1,
      shadowRadius: 28,
      elevation: 3,
    },
    popover: {
      shadowColor: '#413F36',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 6,
    },
    fab: {
      shadowColor: '#5E7A62',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 6,
    },
    sheet: {
      shadowColor: '#4A5840',
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 12,
    },
  },
};
