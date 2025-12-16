/**
 * Utilities for theme-based styling
 * 
 * @module utils/styleUtils
 */

import { StyleSheet, ViewStyle, TextStyle, Platform, I18nManager } from 'react-native';
import { FormioTheme } from '../context/FormioContext';

/**
 * Style utilities for applying theme-based values
 */
export interface StyleUtilities {
  getColor: (key: string, fallback?: string) => string | undefined;
  getSpacing: (key: string, fallback?: number) => number | undefined;
  getFont: (key: string, fallback?: number) => number | undefined;
  getComponentValue: (path: string, fallback?: any) => any;
  createStyles: (callback: (theme: FormioTheme) => any) => any;
  createRTLStyles: (ltrStyle: ViewStyle | TextStyle, rtlStyle?: ViewStyle | TextStyle) => ViewStyle | TextStyle;
}

/**
 * Create theme-aware style utilities
 */
export function createStyleUtilities(theme?: FormioTheme): StyleUtilities {
  const isRTL = I18nManager.isRTL;

  const getColor = (key: string, fallback?: string): string | undefined => {
    const parts = key.split('.');
    let value: any = theme?.colors;

    for (const part of parts) {
      value = value?.[part];
    }

    return value || fallback;
  };

  const getSpacing = (key: string, fallback?: number): number | undefined => {
    const parts = key.split('.');
    let value: any = theme?.spacing;

    for (const part of parts) {
      value = value?.[part];
    }

    return value || fallback;
  };

  const getFont = (key: string, fallback?: number): number | undefined => {
    const parts = key.split('.');
    let value: any = theme?.typography?.fontSize;

    for (const part of parts) {
      value = value?.[part];
    }

    return value || fallback;
  };

  const getComponentValue = (path: string, fallback?: any): any => {
    const parts = path.split('.');
    let value: any = theme?.components;

    for (const part of parts) {
      value = value?.[part];
    }

    return value ?? fallback;
  };

  const createStyles = (callback: (theme: FormioTheme) => any): any => {
    const styles = callback(theme || ({} as FormioTheme));
    return StyleSheet.create(styles);
  };

  const createRTLStyles = (
    ltrStyle: ViewStyle | TextStyle,
    rtlStyle?: ViewStyle | TextStyle
  ): ViewStyle | TextStyle => {
    if (!isRTL) {
      return ltrStyle;
    }

    if (rtlStyle) {
      return { ...ltrStyle, ...rtlStyle };
    }

    // Auto-reverse flex direction and margins/padding
    const reversed: any = { ...ltrStyle };

    if (reversed.flexDirection === 'row') {
      reversed.flexDirection = 'row-reverse';
    }

    // Swap margin directions
    if (reversed.marginRight !== undefined && reversed.marginLeft === undefined) {
      reversed.marginLeft = reversed.marginRight;
      delete reversed.marginRight;
    }
    if (reversed.marginLeft !== undefined && reversed.marginRight === undefined) {
      reversed.marginRight = reversed.marginLeft;
      delete reversed.marginLeft;
    }

    // Swap padding directions
    if (reversed.paddingRight !== undefined && reversed.paddingLeft === undefined) {
      reversed.paddingLeft = reversed.paddingRight;
      delete reversed.paddingRight;
    }
    if (reversed.paddingLeft !== undefined && reversed.paddingRight === undefined) {
      reversed.paddingRight = reversed.paddingLeft;
      delete reversed.paddingLeft;
    }

    // Swap border radius if applicable
    if (reversed.borderTopRightRadius !== undefined) {
      [reversed.borderTopLeftRadius, reversed.borderTopRightRadius] = [
        reversed.borderTopRightRadius,
        reversed.borderTopLeftRadius,
      ];
    }
    if (reversed.borderBottomRightRadius !== undefined) {
      [reversed.borderBottomLeftRadius, reversed.borderBottomRightRadius] = [
        reversed.borderBottomRightRadius,
        reversed.borderBottomLeftRadius,
      ];
    }

    // Text alignment
    if (reversed.textAlign === 'left') {
      reversed.textAlign = 'right';
    } else if (reversed.textAlign === 'right') {
      reversed.textAlign = 'left';
    }

    return reversed;
  };

  return {
    getColor,
    getSpacing,
    getFont,
    getComponentValue,
    createStyles,
    createRTLStyles,
  };
}

/**
 * Create responsive styles for platform
 */
export function createPlatformStyles(
  iosStyle: ViewStyle | TextStyle,
  androidStyle?: ViewStyle | TextStyle
): ViewStyle | TextStyle {
  return Platform.select({
    ios: iosStyle,
    android: androidStyle || iosStyle,
    default: iosStyle,
  }) as ViewStyle | TextStyle;
}
