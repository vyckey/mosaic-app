/**
 * Mosaic Design System
 *
 * Raw color palette.（视觉原材料，与 docs/mosaic-prototype-v2.html 对齐）
 *
 * 注意：
 * - 这里定义的是视觉原材料
 * - 不应该在组件中直接使用
 * - Light / Dark 的语义映射放在 theme/ 中
 */

export const colors = {
  /**
   * Sage（品牌色）
   *
   * 鼠尾草绿。原型中的 --sage / --sage-deep / --sage2 / --sage3，
   * 用于 primary、选中态、进度、强调边框等。
   */
  sage: {
    50: '#EEF2E8',
    100: '#E7EDE0',
    200: '#E1EBD9', // --sage2
    300: '#B6C9AA', // --sage3
    400: '#93AB89',
    500: '#74956D', // --sage
    600: '#5A7A53', // --sage-deep
    700: '#496344',
    800: '#3B4F37',
    900: '#31412E',
    950: '#1D261B',
  },

  /**
   * Moss（带绿调的中性色）
   *
   * 原型中的 --bg / --paper / --paper2 / --ink / --muted / --line。
   * 不用冷灰，让界面柔和、有生活感。
   */
  moss: {
    50: '#FCFDF8', // --paper
    100: '#F1F4EA', // --bg
    200: '#EDF1E5', // --paper2
    300: '#DFE5D5', // --line
    400: '#C3CCB8',
    500: '#A2AC97',
    600: '#7D8779', // --muted
    700: '#5F685C',
    800: '#434B41',
    900: '#2B3329', // --ink
    950: '#1C211A',
  },

  /**
   * Clay（暖陶土色）
   *
   * 原型中的 --clay / .clay 卡片。
   * 用于 warning、地图 pin、温暖强调卡片。
   */
  clay: {
    50: '#FBF5F0',
    100: '#F2E6DC', // .clay 卡片底色
    200: '#E8D2C2',
    300: '#DBB8A2',
    400: '#CDA087',
    500: '#C09077', // --clay
    600: '#A9765C',
    700: '#8B5E49',
    800: '#6F4C3C',
    900: '#5B3F33',
  },

  /**
   * Lavender（灰紫色）
   *
   * 原型中的 --lav / .lav 卡片（每日一问、MBTI 等）。
   */
  lavender: {
    50: '#F5F4F9',
    100: '#ECE9F3', // .lav 卡片底色
    200: '#DDD8EA',
    300: '#C2BCD3', // --lav
    400: '#A9A1C0',
    500: '#8F85AD',
    600: '#7A6F96',
    700: '#655B7D',
    800: '#514A64',
    900: '#423D52',
  },

  /**
   * Rose
   *
   * 用于 destructive / error。不使用非常鲜艳的红色。
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
