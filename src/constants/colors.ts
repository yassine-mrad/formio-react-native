/**
 * Default color constants
 * 
 * @module constants/colors
 */

export const DEFAULT_COLORS = {
  PRIMARY: '#007AFF',
  SECONDARY: '#5856D6',
  ERROR: '#FF3B30',
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  INFO: '#00B0FF',
  BACKGROUND: '#FFFFFF',
  SURFACE: '#F2F2F7',
  TEXT: '#333333',
  TEXT_SECONDARY: '#8E8E93',
  BORDER: '#C7C7CC',
  BORDER_FOCUS: '#007AFF',
  DISABLED: '#F0F0F0',
  PLACEHOLDER: '#C7C7CC',
} as const;

export type ColorKey = keyof typeof DEFAULT_COLORS;
