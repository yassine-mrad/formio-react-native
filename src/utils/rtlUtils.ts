/**
 * RTL (Right-to-Left) Utilities for proper text direction support
 * 
 * Handles RTL layout adjustments for Arabic, Hebrew, and other RTL languages
 * 
 * @module utils/rtlUtils
 */

import { ViewStyle, TextStyle, I18nManager } from 'react-native';

/**
 * Get text alignment based on RTL setting
 */
export function getTextAlign(isRTL: boolean): 'left' | 'right' | 'center' {
  return isRTL ? 'right' : 'left';
}

/**
 * Get flex direction based on RTL setting
 */
export function getFlexDirection(isRTL: boolean): 'row' | 'row-reverse' | 'column' | 'column-reverse' {
  return isRTL ? 'row-reverse' : 'row';
}

/**
 * Get text direction for ScrollView and other containers
 */
export function getTextDirection(isRTL: boolean): 'rtl' | 'ltr' {
  return isRTL ? 'rtl' : 'ltr';
}

/**
 * Swap left/right margins for RTL
 */
export function swapMargins(style: ViewStyle | TextStyle, isRTL: boolean): ViewStyle | TextStyle {
  if (!isRTL) return style;

  const swapped = { ...style };
  
  // Swap marginLeft and marginRight
  if ('marginLeft' in swapped && 'marginRight' in swapped) {
    [swapped.marginLeft, swapped.marginRight] = [swapped.marginRight, swapped.marginLeft];
  } else if ('marginLeft' in swapped) {
    swapped.marginRight = swapped.marginLeft;
    delete swapped.marginLeft;
  } else if ('marginRight' in swapped) {
    swapped.marginLeft = swapped.marginRight;
    delete swapped.marginRight;
  }

  // Swap marginStart and marginEnd
  if ('marginStart' in swapped && 'marginEnd' in swapped) {
    [swapped.marginStart, swapped.marginEnd] = [swapped.marginEnd, swapped.marginStart];
  }

  return swapped;
}

/**
 * Swap left/right padding for RTL
 */
export function swapPadding(style: ViewStyle | TextStyle, isRTL: boolean): ViewStyle | TextStyle {
  if (!isRTL) return style;

  const swapped = { ...style };

  // Swap paddingLeft and paddingRight
  if ('paddingLeft' in swapped && 'paddingRight' in swapped) {
    [swapped.paddingLeft, swapped.paddingRight] = [swapped.paddingRight, swapped.paddingLeft];
  } else if ('paddingLeft' in swapped) {
    swapped.paddingRight = swapped.paddingLeft;
    delete swapped.paddingLeft;
  } else if ('paddingRight' in swapped) {
    swapped.paddingLeft = swapped.paddingRight;
    delete swapped.paddingRight;
  }

  // Swap paddingStart and paddingEnd
  if ('paddingStart' in swapped && 'paddingEnd' in swapped) {
    [swapped.paddingStart, swapped.paddingEnd] = [swapped.paddingEnd, swapped.paddingStart];
  }

  return swapped;
}

/**
 * Swap border radius for RTL (top-left ↔ top-right, bottom-left ↔ bottom-right)
 */
export function swapBorderRadius(style: ViewStyle | TextStyle, isRTL: boolean): ViewStyle | TextStyle {
  if (!isRTL) return style;

  const swapped = { ...style };

  // Swap top corners
  if ('borderTopLeftRadius' in swapped && 'borderTopRightRadius' in swapped) {
    [swapped.borderTopLeftRadius, swapped.borderTopRightRadius] = [
      swapped.borderTopRightRadius,
      swapped.borderTopLeftRadius,
    ];
  }

  // Swap bottom corners
  if ('borderBottomLeftRadius' in swapped && 'borderBottomRightRadius' in swapped) {
    [swapped.borderBottomLeftRadius, swapped.borderBottomRightRadius] = [
      swapped.borderBottomRightRadius,
      swapped.borderBottomLeftRadius,
    ];
  }

  return swapped;
}

/**
 * Apply all RTL transformations to a style object
 */
export function applyRTLStyle(style: ViewStyle | TextStyle, isRTL: boolean): ViewStyle | TextStyle {
  if (!isRTL) return style;

  let transformed = { ...style };
  transformed = swapMargins(transformed, true);
  transformed = swapPadding(transformed, true);
  transformed = swapBorderRadius(transformed, true);

  // Swap text alignment
  if ('textAlign' in transformed) {
    if (transformed.textAlign === 'left') {
      transformed.textAlign = 'right';
    } else if (transformed.textAlign === 'right') {
      transformed.textAlign = 'left';
    }
  }

  return transformed;
}

/**
 * Create RTL-aware style with LTR and RTL variants
 */
export function createRTLStyle(
  ltrStyle: ViewStyle | TextStyle,
  rtlStyle?: ViewStyle | TextStyle,
  isRTL?: boolean
): ViewStyle | TextStyle {
  const shouldUseRTL = isRTL ?? I18nManager.isRTL;

  if (!shouldUseRTL) {
    return ltrStyle;
  }

  if (rtlStyle) {
    return { ...ltrStyle, ...rtlStyle };
  }

  return applyRTLStyle(ltrStyle, true);
}

/**
 * Get icon rotation for RTL (useful for arrows, chevrons, etc.)
 * Returns rotation in degrees
 */
export function getIconRotation(isRTL: boolean, defaultRotation: number = 0): number {
  // For arrows and directional icons, flip them in RTL
  // This is a simple 180-degree rotation for left/right arrows
  return isRTL ? defaultRotation + 180 : defaultRotation;
}

/**
 * Get transform for flipping icons horizontally in RTL
 */
export function getIconFlipTransform(isRTL: boolean): Array<{ scaleX: number }> {
  return [{ scaleX: isRTL ? -1 : 1 }];
}

/**
 * Utility to check if current system is RTL
 */
export function isSystemRTL(): boolean {
  return I18nManager.isRTL;
}

/**
 * Get alignment for flex items based on RTL
 */
export function getAlignSelf(isRTL: boolean, alignment: 'flex-start' | 'flex-end' | 'center'): 'flex-start' | 'flex-end' | 'center' {
  if (alignment === 'center') return 'center';
  
  if (isRTL) {
    return alignment === 'flex-start' ? 'flex-end' : 'flex-start';
  }
  
  return alignment;
}

/**
 * Get justify content based on RTL
 */
export function getJustifyContent(isRTL: boolean, justify: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'): string {
  if (justify === 'center' || justify === 'space-between' || justify === 'space-around') {
    return justify;
  }

  if (isRTL) {
    return justify === 'flex-start' ? 'flex-end' : 'flex-start';
  }

  return justify;
}

/**
 * Create a style object with automatic RTL handling
 * 
 * @example
 * ```typescript
 * const style = createRTLAwareStyle({
 *   marginLeft: 10,
 *   textAlign: 'left',
 * }, isRTL);
 * // In RTL: { marginRight: 10, textAlign: 'right' }
 * // In LTR: { marginLeft: 10, textAlign: 'left' }
 * ```
 */
export function createRTLAwareStyle(
  style: ViewStyle | TextStyle,
  isRTL: boolean
): ViewStyle | TextStyle {
  return applyRTLStyle(style, isRTL);
}
