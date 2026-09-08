import { colors } from '@/design/colors';

import type { Theme } from './types';

export const lightTheme: Theme = {
  colors: {
    background: colors.stone[200],
    backgroundMuted: colors.stone[300],
    backgroundSubtle: colors.stone[300],

    surface: colors.white,
    surfaceMuted: colors.stone[100],

    text: colors.stone[900],
    textMuted: colors.stone[600],
    textSubtle: colors.stone[500],
    textDisabled: colors.stone[400],

    primary: colors.lavender[500],
    primaryForeground: colors.white,

    secondary: colors.stone[100],
    secondaryForeground: colors.stone[700],

    border: colors.stone[300],
    borderMuted: colors.stone[300],
    borderStrong: colors.stone[400],

    focus: colors.lavender[500],

    success: colors.sage[500],
    successForeground: colors.white,
    successMuted: colors.sage[100],
    successMutedForeground: colors.sage[700],

    warning: colors.peach[500],
    warningForeground: colors.white,
    warningMuted: colors.peach[100],
    warningMutedForeground: colors.peach[700],

    danger: colors.rose[500],
    dangerForeground: colors.white,
    dangerMuted: colors.rose[100],
    dangerMutedForeground: colors.rose[700],

    info: colors.sky[500],
    infoForeground: colors.white,
    infoMuted: colors.sky[100],
    infoMutedForeground: colors.sky[700],
  },
};
