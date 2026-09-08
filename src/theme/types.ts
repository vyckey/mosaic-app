import type { ViewStyle } from 'react-native';

/**
 * 阴影 token。
 * 使用 RN shadow props（iOS/Android），react-native-web 会自动转换为 box-shadow。
 */
export type ShadowToken = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius'
> & { elevation?: number };

export interface ThemeColors {
  background: string;
  backgroundMuted: string;
  backgroundSubtle: string;

  surface: string;
  surfaceMuted: string;

  text: string;
  textMuted: string;
  textSubtle: string;
  textDisabled: string;

  /** 品牌鼠尾草绿 */
  primary: string;
  primaryForeground: string;
  /** 浅鼠尾草底（chip / icon badge / toggle 轨道） */
  primaryMuted: string;
  primaryMutedForeground: string;
  /** 中鼠尾草（handle / 图表 / 关系圈） */
  primarySoft: string;
  /** 深鼠尾草（按压态 / toast / 渐变终点） */
  primaryStrong: string;

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

  /** 强调色：薰衣草（每日一问 / MBTI 卡片） */
  accentLav: string;
  accentLavMuted: string;
  /** 强调色：陶土（人生故事 / 地图 pin 卡片） */
  accentClay: string;
  accentClayMuted: string;
}

/** 圆角 token，对应原型：tile 12 / btn 14 / stat 16 / card 22 / sheet 32 */
export interface ThemeRadius {
  tile: number;
  btn: number;
  stat: number;
  card: number;
  sheet: number;
  full: number;
}

export interface TypographyToken {
  fontSize: number;
  lineHeight: number;
  fontWeight?: '400' | '500' | '600' | '700' | '800';
  letterSpacing?: number;
}

/**
 * 字体 token，对应原型：
 * h1 28 / h2 20 / h3 16 / p 14 / .muted 13 / .tiny 12，micro 10 用于图片角标等叠层文字
 */
export interface ThemeTypography {
  display: TypographyToken;
  title: TypographyToken;
  subtitle: TypographyToken;
  body: TypographyToken;
  caption: TypographyToken;
  tiny: TypographyToken;
  micro: TypographyToken;
}

/** 间距 token（4 的倍数为主，页面/卡片留白取原型的 18） */
export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  /** 页面左右留白（原型 .content padding 18） */
  page: number;
  /** 卡片内边距（原型 .card padding 18） */
  card: number;
  /** 卡片之间的垂直间距（原型 .card margin 12） */
  cardGap: number;
}

export interface ThemeShadows {
  /** 卡片（原型 --shadow: 0 12px 28px rgba(74,88,64,.1)） */
  card: ShadowToken;
  /** 浮层：quick composer / 导航条 */
  popover: ShadowToken;
  /** FAB */
  fab: ShadowToken;
  /** 底部弹层 */
  sheet: ShadowToken;
}

export interface Theme {
  colors: ThemeColors;
  radius: ThemeRadius;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  shadows: ThemeShadows;
}
