/**
 * Typography constants
 * 
 * @module constants/typography
 */

export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
} as const;

export const FONT_WEIGHTS = {
  LIGHT: '300' as const,
  NORMAL: '400' as const,
  MEDIUM: '500' as const,
  SEMI_BOLD: '600' as const,
  BOLD: '700' as const,
} as const;

export const LINE_HEIGHTS = {
  TIGHT: 1.2,
  NORMAL: 1.5,
  RELAXED: 1.8,
} as const;

export type FontSizeKey = keyof typeof FONT_SIZES;
export type FontWeightKey = keyof typeof FONT_WEIGHTS;
export type LineHeightKey = keyof typeof LINE_HEIGHTS;
