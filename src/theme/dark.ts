import { colors } from '@/design/colors';

import type { Theme } from './types';

export const darkTheme: Theme = {
  colors: {
    background: colors.stone[950],
    backgroundMuted: colors.stone[900],
    backgroundSubtle: colors.stone[800],

    surface: colors.stone[900],
    surfaceMuted: colors.stone[800],

    text: colors.stone[50],
    textMuted: colors.stone[400],
    textSubtle: colors.stone[500],
    textDisabled: colors.stone[600],

    primary: colors.lavender[400],
    primaryForeground: colors.stone[950],

    secondary: colors.stone[800],
    secondaryForeground: colors.stone[200],

    border: colors.stone[700],
    borderMuted: colors.stone[800],
    borderStrong: colors.stone[600],

    focus: colors.lavender[400],

    success: colors.sage[400],
    successForeground: colors.stone[950],
    successMuted: colors.sage[900],
    successMutedForeground: colors.sage[200],

    warning: colors.peach[400],
    warningForeground: colors.stone[950],
    warningMuted: colors.peach[900],
    warningMutedForeground: colors.peach[200],

    danger: colors.rose[400],
    dangerForeground: colors.stone[950],
    dangerMuted: colors.rose[900],
    dangerMutedForeground: colors.rose[200],

    info: colors.sky[400],
    infoForeground: colors.stone[950],
    infoMuted: colors.sky[900],
    infoMutedForeground: colors.sky[200],
  },
};
