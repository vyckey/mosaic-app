/**
 * Mosaic Design System
 *
 * Raw color palette.
 *
 * 注意：
 * - 这里定义的是视觉原材料
 * - 不应该在组件中直接使用
 * - Light / Dark 的语义映射放在 theme/ 中
 */

export const colors = {
  /**
   * Brand
   *
   * 柔和的 Lavender / Periwinkle。
   * 不使用高饱和蓝色，避免整体过于严肃。
   */
  lavender: {
    50: '#F7F7FF',
    100: '#F0F1FF',
    200: '#E3E5FF',
    300: '#CDD0FF',
    400: '#B4B9FF',
    500: '#9AA1F8',
    600: '#828AE8',
    700: '#6B73D0',
    800: '#565DB0',
    900: '#454A8A',
  },

  /**
   * Warm neutral
   *
   * 使用带一点暖色的 Stone，而不是冷灰。
   * 让界面更柔和、更有生活感。
   */
  stone: {
    50: '#FCFBFA',
    100: '#F7F5F3',
    200: '#EEEAE7',
    300: '#E2DDD9',
    400: '#C8C1BB',
    500: '#A69E97',
    600: '#827A73',
    700: '#625B55',
    800: '#443F3B',
    900: '#2D2926',
    950: '#1E1B19',
  },

  /**
   * Sage
   *
   * 用于 success / positive 等状态。
   */
  sage: {
    50: '#F4F9F5',
    100: '#E8F2EA',
    200: '#D1E5D5',
    300: '#B2D2B9',
    400: '#91B99A',
    500: '#769F80',
    600: '#5D8668',
    700: '#496A52',
    800: '#3C5542',
    900: '#33463A',
  },

  /**
   * Peach
   *
   * 用于 warning / warm accent。
   */
  peach: {
    50: '#FFF8F3',
    100: '#FDEEE5',
    200: '#FADBCB',
    300: '#F4C2A8',
    400: '#E9A184',
    500: '#D98668',
    600: '#C66E52',
    700: '#A85640',
    800: '#884638',
    900: '#703C32',
  },

  /**
   * Rose
   *
   * 用于 destructive / error。
   *
   * 不使用非常鲜艳的红色。
   */
  rose: {
    50: '#FFF7F7',
    100: '#FDECEC',
    200: '#F9D6D6',
    300: '#F2B8B8',
    400: '#E99A9A',
    500: '#DB7E7E',
    600: '#C76565',
    700: '#A84F4F',
    800: '#884343',
    900: '#713B3B',
  },

  /**
   * Sky
   *
   * 少量用于 info。
   */
  sky: {
    50: '#F5FAFC',
    100: '#E8F3F7',
    200: '#D2E7ED',
    300: '#B1D4DE',
    400: '#8FBBC8',
    500: '#72A4B3',
    600: '#5B8998',
    700: '#4B707D',
    800: '#405C66',
    900: '#394E56',
  },

  /**
   * Pure colors
   */
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type Colors = typeof colors;
