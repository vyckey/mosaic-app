import { vars } from 'nativewind';

import { darkTheme, lightTheme, type MosaicTheme } from '@/theme';

const toCssVariables = (theme: MosaicTheme) => ({
  '--background': theme.background,
  '--foreground': theme.foreground,

  '--card': theme.card,
  '--card-foreground': theme.cardForeground,

  '--popover': theme.popover,
  '--popover-foreground': theme.popoverForeground,

  '--primary': theme.primary,
  '--primary-foreground': theme.primaryForeground,

  '--secondary': theme.secondary,
  '--secondary-foreground': theme.secondaryForeground,

  '--accent': theme.accent,
  '--accent-foreground': theme.accentForeground,

  '--muted': theme.muted,
  '--muted-foreground': theme.mutedForeground,

  '--destructive': theme.destructive,

  '--border': theme.border,
  '--input': theme.input,
  '--ring': theme.ring,

  '--success': theme.success,
  '--success-foreground': theme.successForeground,

  '--warning': theme.warning,
  '--warning-foreground': theme.warningForeground,

  '--info': theme.info,
  '--info-foreground': theme.infoForeground,
});

export const config = {
  light: vars(toCssVariables(lightTheme)),
  dark: vars(toCssVariables(darkTheme)),
};
