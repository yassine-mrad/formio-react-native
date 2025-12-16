/**
 * Constants index - export all constants
 *
 * @module constants
 */

import { DEFAULT_COLORS } from './colors';
import { FONT_SIZES, FONT_WEIGHTS } from './typography';

export { DEFAULT_COLORS } from './colors';
export type { ColorKey } from './colors';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};
export type { SpacingKey } from './spacing';

export { FONT_SIZES, FONT_WEIGHTS, LINE_HEIGHTS } from './typography';
export type { FontSizeKey, FontWeightKey, LineHeightKey } from './typography';

export {
  COMPONENT_TYPES,
  INPUT_COMPONENT_TYPES,
  CONTAINER_COMPONENT_TYPES,
  DISPLAY_COMPONENT_TYPES,
} from './componentTypes';
export type { ComponentType } from './componentTypes';

export { VALIDATION_MESSAGES } from './validationMessages';
export type { ValidationMessageKey } from './validationMessages';

// Aliases for backward compatibility
export const COLORS = {
  primary: DEFAULT_COLORS.PRIMARY,
  secondary: DEFAULT_COLORS.SECONDARY,
  error: DEFAULT_COLORS.ERROR,
  success: DEFAULT_COLORS.SUCCESS,
  warning: DEFAULT_COLORS.WARNING,
  info: DEFAULT_COLORS.INFO,
  background: DEFAULT_COLORS.BACKGROUND,
  surface: DEFAULT_COLORS.SURFACE,
  text: DEFAULT_COLORS.TEXT,
  textSecondary: DEFAULT_COLORS.TEXT_SECONDARY,
  border: DEFAULT_COLORS.BORDER,
  borderFocus: DEFAULT_COLORS.BORDER_FOCUS,
  disabled: DEFAULT_COLORS.DISABLED,
  placeholder: DEFAULT_COLORS.PLACEHOLDER,
  warningLight: '#FFF3CD',
  primaryLight: '#E3F2FD',
};

export const TYPOGRAPHY = {
  fontSize: {
    xs: FONT_SIZES.XS,
    sm: FONT_SIZES.SM,
    md: FONT_SIZES.MD,
    lg: FONT_SIZES.LG,
    xl: FONT_SIZES.XL,
    xxl: FONT_SIZES.XXL,
  },
  fontWeight: {
    light: FONT_WEIGHTS.LIGHT,
    normal: FONT_WEIGHTS.NORMAL,
    medium: FONT_WEIGHTS.MEDIUM,
    semibold: FONT_WEIGHTS.SEMI_BOLD,
    bold: FONT_WEIGHTS.BOLD,
  },
};
