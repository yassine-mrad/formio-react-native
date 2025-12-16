/**
 * Error Boundary component for catching rendering errors
 * 
 * @module errors/ErrorBoundary
 */

import React, { ReactNode, ReactElement } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DEFAULT_COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { FONT_SIZES } from '../constants/typography';

/**
 * Props for ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, info: { componentStack: string }) => void;
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component for catching and displaying rendering errors gracefully
 * 
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error, reset) => (
 *     <View>
 *       <Text>Error: {error.message}</Text>
 *       <Button title="Try again" onPress={reset} />
 *     </View>
 *   )}
 * >
 *   <FormioForm form={schema} />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }): void {
    const { onError } = this.props;
    if (onError) {
      onError(error, errorInfo);
    }

    // Log to console in development
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (!hasError) {
      return children;
    }

    if (fallback) {
      if (typeof fallback === 'function') {
        return fallback(error!, this.handleReset);
      }
      return fallback;
    }

    // Default error UI
    return <DefaultErrorUI error={error} onReset={this.handleReset} />;
  }
}

/**
 * Default error UI component
 */
const DefaultErrorUI: React.FC<{ error?: Error; onReset: () => void }> = ({
  error,
  onReset,
}) => (
  <View style={styles.container}>
    <View style={styles.errorBox}>
      <Text style={styles.errorTitle}>⚠️ Something went wrong</Text>
      <Text style={styles.errorMessage}>
        {error?.message || 'An unexpected error occurred'}
      </Text>
      {__DEV__ && error?.stack && (
        <Text style={styles.errorStack}>{error.stack}</Text>
      )}
      <TouchableOpacity style={styles.resetButton} onPress={onReset}>
        <Text style={styles.resetButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LG,
    backgroundColor: DEFAULT_COLORS.BACKGROUND,
  },
  errorBox: {
    backgroundColor: '#FFF3CD',
    borderColor: DEFAULT_COLORS.WARNING,
    borderWidth: 1,
    borderRadius: 8,
    padding: SPACING.LG,
    maxWidth: 400,
  },
  errorTitle: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '600',
    color: '#856404',
    marginBottom: SPACING.MD,
  },
  errorMessage: {
    fontSize: FONT_SIZES.MD,
    color: '#856404',
    marginBottom: SPACING.MD,
    lineHeight: 1.5,
  },
  errorStack: {
    fontSize: FONT_SIZES.XS,
    color: '#856404',
    fontFamily: 'Courier New',
    marginBottom: SPACING.MD,
    maxHeight: 200,
  },
  resetButton: {
    backgroundColor: DEFAULT_COLORS.PRIMARY,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: SPACING.MD,
  },
  resetButtonText: {
    color: DEFAULT_COLORS.BACKGROUND,
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
  },
});
