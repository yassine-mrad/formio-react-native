/**
 * Performance Optimization Utilities
 * 
 * Provides utilities for memoization, debouncing, throttling,
 * and performance monitoring
 * 
 * @module utils/performanceUtils
 */

import { useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * Debounce a function to delay execution until after a specified time
 * 
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query: string) => {
 *   performSearch(query);
 * }, 300);
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle a function to limit execution frequency
 * 
 * @example
 * ```typescript
 * const throttledScroll = throttle((event) => {
 *   handleScroll(event);
 * }, 100);
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * React hook for debounced value
 * 
 * @example
 * ```typescript
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
 * 
 * useEffect(() => {
 *   performSearch(debouncedSearchTerm);
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * React hook for debounced callback
 * 
 * @example
 * ```typescript
 * const debouncedSearch = useDebouncedCallback((query: string) => {
 *   performSearch(query);
 * }, 300, []);
 * ```
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay, ...deps]
  );
}

/**
 * React hook for throttled callback
 * 
 * @example
 * ```typescript
 * const throttledScroll = useThrottledCallback((event) => {
 *   handleScroll(event);
 * }, 100, []);
 * ```
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList
): (...args: Parameters<T>) => void {
  const lastRunRef = useRef<number>(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRunRef.current >= delay) {
        callback(...args);
        lastRunRef.current = now;
      }
    },
    [callback, delay, ...deps]
  );
}

/**
 * Memoize a function result based on arguments
 * 
 * @example
 * ```typescript
 * const memoizedCompute = memoize((a: number, b: number) => {
 *   return expensiveComputation(a, b);
 * });
 * ```
 */
export function memoize<T extends (...args: any[]) => any>(func: T): T {
  const cache = new Map();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * React hook for memoized value with custom comparison
 * 
 * @example
 * ```typescript
 * const memoizedData = useMemoizedValue(data, (prev, next) => {
 *   return prev.id === next.id;
 * });
 * ```
 */
export function useMemoizedValue<T>(
  value: T,
  isEqual: (prev: T, next: T) => boolean
): T {
  const prevRef = useRef<T>(value);
  const [memoized, setMemoized] = React.useState<T>(value);

  useEffect(() => {
    if (!isEqual(prevRef.current, value)) {
      prevRef.current = value;
      setMemoized(value);
    }
  }, [value, isEqual]);

  return memoized;
}

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number> = new Map();

  /**
   * Start measuring a performance metric
   */
  start(label: string): void {
    this.marks.set(label, performance.now());
  }

  /**
   * End measuring and record the duration
   */
  end(label: string): number {
    const startTime = this.marks.get(label);
    if (!startTime) {
      console.warn(`Performance mark "${label}" not found`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.measures.set(label, duration);
    this.marks.delete(label);

    return duration;
  }

  /**
   * Get recorded measurement
   */
  getMeasure(label: string): number | undefined {
    return this.measures.get(label);
  }

  /**
   * Get all measurements
   */
  getAllMeasures(): Record<string, number> {
    return Object.fromEntries(this.measures);
  }

  /**
   * Clear all measurements
   */
  clear(): void {
    this.marks.clear();
    this.measures.clear();
  }

  /**
   * Log all measurements
   */
  log(): void {
    console.log('[Performance Metrics]', this.getAllMeasures());
  }
}

/**
 * React hook for performance monitoring
 * 
 * @example
 * ```typescript
 * const monitor = usePerformanceMonitor();
 * 
 * useEffect(() => {
 *   monitor.start('render');
 *   // ... do work
 *   const duration = monitor.end('render');
 *   console.log(`Render took ${duration}ms`);
 * }, []);
 * ```
 */
export function usePerformanceMonitor(): PerformanceMonitor {
  return useMemo(() => new PerformanceMonitor(), []);
}

/**
 * Batch multiple state updates
 * 
 * @example
 * ```typescript
 * batchUpdates(() => {
 *   setState1(value1);
 *   setState2(value2);
 *   setState3(value3);
 * });
 * ```
 */
export function batchUpdates(callback: () => void): void {
  // In React 18+, this is handled automatically
  // For older versions, this would use unstable_batchedUpdates
  callback();
}

/**
 * Lazy load a component
 * 
 * @example
 * ```typescript
 * const HeavyComponent = lazy(() => import('./HeavyComponent'));
 * ```
 */
export function lazy<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(importFunc);
}

/**
 * Create a virtual list for rendering large lists efficiently
 */
export interface VirtualListConfig {
  itemHeight: number;
  containerHeight: number;
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
}

/**
 * Calculate visible items for virtual scrolling
 */
export function getVisibleItems(
  scrollOffset: number,
  containerHeight: number,
  itemHeight: number,
  items: any[]
): { startIndex: number; endIndex: number; visibleItems: any[] } {
  const startIndex = Math.floor(scrollOffset / itemHeight);
  const endIndex = Math.ceil((scrollOffset + containerHeight) / itemHeight);

  return {
    startIndex,
    endIndex: Math.min(endIndex, items.length),
    visibleItems: items.slice(startIndex, endIndex),
  };
}

/**
 * Measure component render time
 * 
 * @example
 * ```typescript
 * const duration = measureRenderTime(() => {
 *   return <MyComponent />;
 * });
 * ```
 */
export function measureRenderTime(renderFunc: () => React.ReactNode): number {
  const start = performance.now();
  renderFunc();
  return performance.now() - start;
}

/**
 * Check if value has changed significantly
 */
export function hasSignificantChange<T>(
  prev: T,
  next: T,
  threshold: number = 0.1
): boolean {
  if (typeof prev !== 'number' || typeof next !== 'number') {
    return prev !== next;
  }

  const percentChange = Math.abs((next - prev) / prev);
  return percentChange > threshold;
}

// Import React for hooks
import React from 'react';
