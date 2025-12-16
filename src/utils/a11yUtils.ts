/**
 * Accessibility (a11y) Utilities for WCAG compliance
 * 
 * Provides utilities for screen reader support, keyboard navigation,
 * focus management, and semantic structure
 * 
 * @module utils/a11yUtils
 */

/**
 * ARIA role types
 */
export type AriaRole = 
  | 'button'
  | 'checkbox'
  | 'radio'
  | 'textbox'
  | 'combobox'
  | 'listbox'
  | 'option'
  | 'group'
  | 'form'
  | 'alert'
  | 'alertdialog'
  | 'dialog'
  | 'progressbar'
  | 'status'
  | 'tab'
  | 'tablist'
  | 'tabpanel';

/**
 * ARIA attributes for accessibility
 */
export interface AriaAttributes {
  /** Role of the element */
  role?: AriaRole;
  /** Label for screen readers */
  label?: string;
  /** Hint text for screen readers */
  hint?: string;
  /** Whether element is disabled */
  disabled?: boolean;
  /** Whether element is required */
  required?: boolean;
  /** Current value for screen readers */
  valueText?: string;
  /** Error message for screen readers */
  errorMessage?: string;
  /** Whether element has an error */
  invalid?: boolean;
  /** Keyboard shortcut hint */
  keyboardHint?: string;
}

/**
 * Get ARIA attributes for a form field
 */
export function getFieldAriaAttributes(
  label: string | undefined,
  error: string | undefined,
  required: boolean = false,
  disabled: boolean = false,
  hint?: string
): Record<string, any> {
  const attributes: Record<string, any> = {
    accessible: true,
    accessibilityRole: 'none', // Let the component handle its own role
  };

  if (label) {
    attributes.accessibilityLabel = label;
  }

  if (error) {
    attributes.accessibilityHint = error;
  } else if (hint) {
    attributes.accessibilityHint = hint;
  }

  if (required) {
    attributes.accessibilityHint = (attributes.accessibilityHint || '') + ' Required field';
  }

  if (disabled) {
    attributes.editable = false;
  }

  return attributes;
}

/**
 * Get ARIA attributes for a button
 */
export function getButtonAriaAttributes(
  label: string,
  disabled: boolean = false,
  hint?: string
): Record<string, any> {
  return {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityState: {
      disabled,
    },
  };
}

/**
 * Get ARIA attributes for a checkbox
 */
export function getCheckboxAriaAttributes(
  label: string,
  checked: boolean,
  disabled: boolean = false,
  hint?: string
): Record<string, any> {
  return {
    accessible: true,
    accessibilityRole: 'checkbox',
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityState: {
      checked,
      disabled,
    },
  };
}

/**
 * Get ARIA attributes for a radio button
 */
export function getRadioAriaAttributes(
  label: string,
  selected: boolean,
  disabled: boolean = false,
  hint?: string
): Record<string, any> {
  return {
    accessible: true,
    accessibilityRole: 'radio',
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityState: {
      selected,
      disabled,
    },
  };
}

/**
 * Get ARIA attributes for a select/dropdown
 */
export function getSelectAriaAttributes(
  label: string,
  selectedValue: string | undefined,
  disabled: boolean = false,
  error?: string,
  hint?: string
): Record<string, any> {
  const attributes: Record<string, any> = {
    accessible: true,
    accessibilityRole: 'combobox',
    accessibilityLabel: label,
    accessibilityState: {
      disabled,
      expanded: false,
    },
  };

  if (selectedValue) {
    attributes.accessibilityValue = {
      text: selectedValue,
    };
  }

  if (error) {
    attributes.accessibilityHint = error;
  } else if (hint) {
    attributes.accessibilityHint = hint;
  }

  return attributes;
}

/**
 * Get ARIA attributes for a text input
 */
export function getTextInputAriaAttributes(
  label: string,
  value: string | undefined,
  disabled: boolean = false,
  error?: string,
  hint?: string,
  required: boolean = false
): Record<string, any> {
  const attributes: Record<string, any> = {
    accessible: true,
    accessibilityRole: 'none',
    accessibilityLabel: label,
  };

  if (value) {
    attributes.accessibilityValue = {
      text: value,
    };
  }

  let hintText = '';
  if (error) {
    hintText = error;
  } else if (hint) {
    hintText = hint;
  }
  if (required) {
    hintText += ' Required field';
  }

  if (hintText) {
    attributes.accessibilityHint = hintText;
  }

  return attributes;
}

/**
 * Get ARIA attributes for a form container
 */
export function getFormAriaAttributes(
  title?: string,
  description?: string
): Record<string, any> {
  return {
    accessible: true,
    accessibilityRole: 'form',
    accessibilityLabel: title,
    accessibilityHint: description,
  };
}

/**
 * Get ARIA attributes for an error message
 */
export function getErrorAriaAttributes(
  message: string
): Record<string, any> {
  return {
    accessible: true,
    accessibilityRole: 'alert',
    accessibilityLabel: 'Error',
    accessibilityHint: message,
    accessibilityLiveRegion: 'polite',
  };
}

/**
 * Get ARIA attributes for a loading indicator
 */
export function getLoadingAriaAttributes(
  message: string = 'Loading'
): Record<string, any> {
  return {
    accessible: true,
    accessibilityRole: 'progressbar',
    accessibilityLabel: message,
    accessibilityLiveRegion: 'polite',
  };
}

/**
 * Get ARIA attributes for a modal/dialog
 */
export function getModalAriaAttributes(
  title: string,
  description?: string
): Record<string, any> {
  return {
    accessible: true,
    accessibilityRole: 'dialog',
    accessibilityLabel: title,
    accessibilityHint: description,
  };
}

/**
 * Get ARIA attributes for a list item
 */
export function getListItemAriaAttributes(
  label: string,
  index: number,
  total: number
): Record<string, any> {
  return {
    accessible: true,
    accessibilityRole: 'option',
    accessibilityLabel: label,
    accessibilityHint: `Item ${index + 1} of ${total}`,
  };
}

/**
 * Get ARIA attributes for a tab
 */
export function getTabAriaAttributes(
  label: string,
  selected: boolean,
  index: number
): Record<string, any> {
  return {
    accessible: true,
    accessibilityRole: 'tab',
    accessibilityLabel: label,
    accessibilityState: {
      selected,
    },
    accessibilityHint: `Tab ${index + 1}`,
  };
}

/**
 * Combine multiple ARIA attributes
 */
export function combineAriaAttributes(
  ...attributes: Array<Record<string, any>>
): Record<string, any> {
  const combined: Record<string, any> = {};

  for (const attr of attributes) {
    Object.assign(combined, attr);
  }

  return combined;
}

/**
 * Create accessible label text with required indicator
 */
export function createAccessibleLabel(
  label: string,
  required: boolean = false,
  error: boolean = false
): string {
  let text = label;
  if (required) text += ', required';
  if (error) text += ', error';
  return text;
}

/**
 * Get keyboard hint text
 */
export function getKeyboardHint(componentType: string): string {
  const hints: Record<string, string> = {
    checkbox: 'Double tap to toggle',
    radio: 'Double tap to select',
    button: 'Double tap to activate',
    select: 'Double tap to open options',
    textfield: 'Type to enter text',
    textarea: 'Type to enter text, use return for new line',
  };

  return hints[componentType] || 'Double tap to interact';
}

/**
 * Check if accessibility is enabled
 */
export function isAccessibilityEnabled(): boolean {
  // This would need to be implemented based on React Native's accessibility API
  // For now, we assume it's always enabled
  return true;
}

/**
 * Announce message to screen reader
 */
export function announceToScreenReader(message: string): void {
  // This would use React Native's AccessibilityInfo API
  // Implementation depends on platform-specific code
  console.log('[A11y Announcement]:', message);
}

/**
 * Create semantic heading
 */
export function getHeadingAriaAttributes(
  level: 1 | 2 | 3 | 4 | 5 | 6,
  text: string
): Record<string, any> {
  return {
    accessible: true,
    accessibilityRole: 'header',
    accessibilityLabel: text,
    accessibilityHint: `Heading level ${level}`,
  };
}
