import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { FormioComponent, FormioFormSchema } from '../types';
import { FormioField } from './FormioField';

export interface WizardPage extends FormioComponent {
  type: 'panel';
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
  onNext?: () => void;
  onPrev?: () => void;
  onFinish?: () => void;
}

export const Wizard: React.FC<Props> = ({ form, component, data, setData, errors, onNext, onPrev, onFinish }) => {
  const [page, setPage] = useState(0);

  const pages = component.pages || [];
  const current = pages[page];

  const getError = (key: string) => errors.find(e => e.field === key)?.message;

  const handleChange = (key: string, value: any) => setData({ ...data, [key]: value });

  const next = () => {
    if (page < pages.length - 1) {
      setPage(page + 1);
      onNext?.();
    } else {
      onFinish?.();
    }
  };
  const prev = () => {
    if (page > 0) {
      setPage(page - 1);
      onPrev?.();
    }
  };

  if (!current) return null;

  return (
    <View>
      {current.label ? <Text style={styles.pageTitle}>{current.label}</Text> : null}
      {current.components.map((c) => (
        <FormioField key={c.key} component={c} value={data[c.key]} onChange={handleChange} error={getError(c.key)} />
      ))}
      <View style={styles.navRow}>
        <TouchableOpacity onPress={prev} style={[styles.navBtn, page === 0 && styles.disabled]} disabled={page === 0}>
          <Text style={styles.navText}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={next} style={styles.navBtn}>
          <Text style={styles.navText}>{page < pages.length - 1 ? 'Next' : 'Finish'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  navBtn: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  navText: {
    color: '#fff',
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});
