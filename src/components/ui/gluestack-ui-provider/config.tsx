import { type Theme } from '@/theme';

export function toCssVariables(theme: Theme) {
  const { colors } = theme;

  return {
    '--color-background': colors.background,
    '--color-background-muted': colors.backgroundMuted,
    '--color-background-subtle': colors.backgroundSubtle,

    '--color-surface': colors.surface,
    '--color-surface-muted': colors.surfaceMuted,

    '--color-text': colors.text,
    '--color-text-muted': colors.textMuted,
    '--color-text-subtle': colors.textSubtle,
    '--color-text-disabled': colors.textDisabled,

    '--color-primary': colors.primary,
    '--color-primary-foreground': colors.primaryForeground,

    '--color-secondary': colors.secondary,
    '--color-secondary-foreground': colors.secondaryForeground,

    '--color-border': colors.border,
    '--color-border-muted': colors.borderMuted,
    '--color-border-strong': colors.borderStrong,

    '--color-focus': colors.focus,

    '--color-success': colors.success,
    '--color-success-foreground': colors.successForeground,
    '--color-success-muted': colors.successMuted,
    '--color-success-muted-foreground': colors.successMutedForeground,

    '--color-warning': colors.warning,
    '--color-warning-foreground': colors.warningForeground,
    '--color-warning-muted': colors.warningMuted,
    '--color-warning-muted-foreground': colors.warningMutedForeground,

    '--color-danger': colors.danger,
    '--color-danger-foreground': colors.dangerForeground,
    '--color-danger-muted': colors.dangerMuted,
    '--color-danger-muted-foreground': colors.dangerMutedForeground,

    '--color-info': colors.info,
    '--color-info-foreground': colors.infoForeground,
    '--color-info-muted': colors.infoMuted,
    '--color-info-muted-foreground': colors.infoMutedForeground,
  };
}
