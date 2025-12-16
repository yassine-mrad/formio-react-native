/**
 * Spacing constants
 * 
 * @module constants/spacing
 */

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
  XXL: 32,
} as const;

export type SpacingKey = keyof typeof SPACING;
