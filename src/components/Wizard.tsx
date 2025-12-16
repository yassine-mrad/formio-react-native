import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { FormioComponent, FormioFormSchema } from '../types';
import { FormioField } from './FormioField';
import { validateForm } from '../validation';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n/I18nContext';

const safeEval = (code: string, ctx: Record<string, any>) => {
  try {
    const fn = new Function(
      'data', 'row', 'value', 'util', 'show',
      `return (function(){\n${code}\nreturn typeof show !== 'undefined' ? show : undefined;\n})();`
    );
    return fn(ctx.data, ctx.row ?? ctx.data, ctx.value, ctx.util ?? {}, undefined);
  } catch (e) {
    return undefined;
  }
};

const isHidden = (component: FormioComponent, data: Record<string, any>): boolean => {
  if (component.hidden) return true;
  const value = data[component.key];
  if (component.customConditional) {
    const res = safeEval(component.customConditional, { data, value, row: data, util: {} });
    if (typeof res === 'boolean') return !res;
    if (res !== undefined) return !Boolean(res);
  }
  if (component.conditional && component.conditional.when) {
    const whenVal = data[component.conditional.when];
    const eq = component.conditional.eq;
    const show = component.conditional.show !== false;
    const match = whenVal === eq;
    return show ? !match : match;
  }
  return false;
};

const applyCalculations = (components: FormioComponent[], data: Record<string, any>): Record<string, any> => {
  let changed = true;
  let guard = 0;
  let next = { ...data };
  while (changed && guard < 5) {
    changed = false;
    guard++;
    for (const c of components) {
      if (c.calculateValue) {
        const current = next[c.key];
        const calc = safeEval(c.calculateValue, { data: next, value: current, row: next, util: {} });
        if (calc !== undefined && calc !== current) {
          next = { ...next, [c.key]: calc };
          changed = true;
        }
      }
    }
  }
  return next;
};

export interface WizardPage extends FormioComponent {
  type: 'panel';
  title?: string;
  components: FormioComponent[];
}

export interface WizardComponent extends FormioComponent {
  type: 'wizard';
  pages: WizardPage[]; // A simplified page structure
}

interface Props {
  form: FormioFormSchema; // The entire form
  component: WizardComponent; // The wizard container
  data: Record<string, any>;
  setData: (data: Record<string, any>) => void;
  errors: Array<{ field: string; message: string }>;
  onValidation?: (errors: Array<{ field: string; message: string }>) => void;
  onNext?: () => void;
  onPrev?: () => void;
  onFinish?: () => void;
}

export const Wizard: React.FC<Props> = ({ form, component, data, setData, errors, onValidation, onNext, onPrev, onFinish }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { createStyles, getColor, getComponent } = useTheme();
  const { translate, isRTL } = useI18n();

  const pages = component.pages || [];
  const currentPageData = pages[currentPage];

  const getError = (key: string) => errors.find(e => e.field === key)?.message;

  const handleChange = (key: string, value: any) => {
    let next = { ...data, [key]: value };
    // Apply calculations after every change
    // @ts-ignore
    const allComponents = pages.flatMap(p => p.components || []);
    next = applyCalculations(allComponents, next);
    setData(next);
  };

  // Validate current page on data change
  useEffect(() => {
    if (currentPageData?.components) {
       // @ts-ignore
      const allComponents = pages.flatMap(p => p.components || []);
      const allErrors = validateForm(allComponents, data);
      onValidation?.(allErrors);
    }
  }, [data, currentPageData, pages, onValidation]);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
      onNext?.();
    } else {
      onFinish?.();
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      onPrev?.();
    }
  };

  if (!currentPageData || pages.length === 0) {
    return <Text>No wizard pages found</Text>;
  }

  const themedStyles = createStyles(() => ({
    wizardContainer: {
      flex: 1,
    },
    pageIndicator: {
      alignItems: 'center',
      marginBottom: getComponent('container.marginBottom', 16),
    },
    pageText: {
      fontSize: getComponent('label.fontSize', 14),
      color: getColor('textSecondary', '#666'),
    },
    pageTitle: {
      fontSize: getComponent('button.fontSize', 20),
      fontWeight: getComponent('button.fontWeight', 'bold') as any,
      marginBottom: getComponent('container.marginBottom', 16),
      textAlign: 'center',
      color: getColor('text', '#333'),
    },
    pageContent: {
      flex: 1,
      marginBottom: getComponent('container.marginBottom', 20),
    },
    navRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: getComponent('container.padding', 16),
      borderTopWidth: 1,
      borderTopColor: getColor('border', '#eee'),
    },
    navBtn: {
      padding: getComponent('button.padding', 12),
      borderRadius: getComponent('button.borderRadius', 8),
      minWidth: 100,
      alignItems: 'center',
      minHeight: getComponent('button.minHeight', 44),
    },
    prevBtn: {
      backgroundColor: getColor('textSecondary', '#6c757d'),
    },
    nextBtn: {
      backgroundColor: getColor('primary', '#007bff'),
    },
    navText: {
      color: getColor('background', '#fff'),
      fontWeight: getComponent('button.fontWeight', '600') as any,
      fontSize: getComponent('button.fontSize', 16),
    },
    disabled: {
      opacity: 0.4,
    },
  }));

  return (
    <View style={themedStyles.wizardContainer}>
      <View style={themedStyles.pageIndicator}>
        <Text style={themedStyles.pageText}>
          Page {currentPage + 1} of {pages.length}
        </Text>
      </View>
      
      {currentPageData.title && (
        <Text style={[themedStyles.pageTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{translate(currentPageData.title, currentPageData.title)}</Text>
      )}
      
      <View style={themedStyles.pageContent}>
        {(currentPageData.components || []).map((c) => {
          if (isHidden(c, data)) return null;
          return (
            <FormioField 
              key={c.key} 
              component={c} 
              value={data[c.key]} 
              onChange={handleChange} 
              error={getError(c.key)} 
            />
          );
        })}
      </View>
      
      <View style={themedStyles.navRow}>
        <TouchableOpacity 
          onPress={prevPage} 
          style={[themedStyles.navBtn, themedStyles.prevBtn, currentPage === 0 && themedStyles.disabled]} 
          disabled={currentPage === 0}
        >
          <Text style={themedStyles.navText}>{translate('Previous', 'Previous')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={nextPage} style={[themedStyles.navBtn, themedStyles.nextBtn]}>
          <Text style={themedStyles.navText}>
            {currentPage < pages.length - 1 ? translate('Next', 'Next') : translate('Finish', 'Finish')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


