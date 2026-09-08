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
    '--color-primary-muted': colors.primaryMuted,
    '--color-primary-muted-foreground': colors.primaryMutedForeground,
    '--color-primary-soft': colors.primarySoft,
    '--color-primary-strong': colors.primaryStrong,

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

    '--color-accent-lav': colors.accentLav,
    '--color-accent-lav-muted': colors.accentLavMuted,
    '--color-accent-clay': colors.accentClay,
    '--color-accent-clay-muted': colors.accentClayMuted,

    /* shadcn 命名别名，供 gluestack 生成的 ui/* 组件跟随主题切换 */
    '--color-foreground': colors.text,
    '--color-card': colors.surface,
    '--color-card-foreground': colors.text,
    '--color-popover': colors.surface,
    '--color-popover-foreground': colors.text,
    '--color-muted': colors.backgroundMuted,
    '--color-muted-foreground': colors.textMuted,
    '--color-accent': colors.primaryMuted,
    '--color-accent-foreground': colors.text,
    '--color-destructive': colors.danger,
    '--color-destructive-foreground': colors.dangerForeground,
    '--color-input': colors.border,
    '--color-ring': colors.focus,
  };
}
