import { useFormioContext } from '../context/FormioContext';
import { StyleSheet } from 'react-native';

export const useTheme = () => {
  const context = useFormioContext();
  
  if (!context) {
    throw new Error('useTheme must be used within FormioProvider');
  }

  const { theme, getThemeValue } = context;

  const createStyles = (styleFactory: (theme: any) => any) => {
    return StyleSheet.create(styleFactory(theme));
  };

  const getColor = (colorKey: string, fallback?: string) => {
    return getThemeValue(`colors.${colorKey}`, fallback);
  };

  const getSpacing = (spacingKey: string, fallback?: number) => {
    return getThemeValue(`spacing.${spacingKey}`, fallback);
  };

  const getTypography = (typographyPath: string, fallback?: any) => {
    return getThemeValue(`typography.${typographyPath}`, fallback);
  };

  const getComponent = (componentPath: string, fallback?: any) => {
    return getThemeValue(`components.${componentPath}`, fallback);
  };

  return {
    theme,
    getThemeValue,
    createStyles,
    getColor,
    getSpacing,
    getTypography,
    getComponent,
  };
};