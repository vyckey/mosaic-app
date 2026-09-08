export interface Theme {
  colors: {
    background: string;
    backgroundMuted: string;
    backgroundSubtle: string;

    surface: string;
    surfaceMuted: string;

    text: string;
    textMuted: string;
    textSubtle: string;
    textDisabled: string;

    primary: string;
    primaryForeground: string;

    secondary: string;
    secondaryForeground: string;

    border: string;
    borderMuted: string;
    borderStrong: string;

    focus: string;

    success: string;
    successForeground: string;
    successMuted: string;
    successMutedForeground: string;

    warning: string;
    warningForeground: string;
    warningMuted: string;
    warningMutedForeground: string;

    danger: string;
    dangerForeground: string;
    dangerMuted: string;
    dangerMutedForeground: string;

    info: string;
    infoForeground: string;
    infoMuted: string;
    infoMutedForeground: string;
  };
}
