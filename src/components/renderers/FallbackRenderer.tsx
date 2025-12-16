/**
 * Fallback Component Renderer
 * 
 * Renders a placeholder for unsupported or unknown component types
 * 
 * @module components/renderers/FallbackRenderer
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ComponentRenderProps } from '../../registry/ComponentRegistry';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import { Logger } from '../../utils/logger';

const logger = new Logger('FallbackRenderer');

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.warningLight,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    borderRadius: 4,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.warning,
    marginBottom: SPACING.xs,
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  details: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: 3,
    fontFamily: 'monospace',
  },
});

/**
 * FallbackRenderer component
 * 
 * Renders when a component type is not registered in the registry.
 * Useful for debugging and handling unknown component types gracefully.
 * 
 * @param props Component render props
 * @returns Rendered fallback component
 */
export const FallbackRenderer: React.FC<ComponentRenderProps> = ({
  component,
}) => {
  const { type, label, key } = component;

  React.useEffect(() => {
    logger.warn(
      `Unknown component type: "${type}" (${label || key || 'unknown'})`
    );
  }, [type, label, key]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unsupported Component Type</Text>
      <Text style={styles.message}>
        Component type "{type}" is not supported or not registered.
      </Text>
      {label && (
        <Text style={styles.message}>
          Label: {label}
        </Text>
      )}
      <Text style={styles.details}>
        {key || 'no-key'}
      </Text>
    </View>
  );
};
