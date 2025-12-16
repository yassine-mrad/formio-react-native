/**
 * Logging utility for development and debugging
 * 
 * @module utils/logger
 */

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  enabled?: boolean;
  level?: LogLevel;
  prefix?: boolean;
  colors?: boolean;
}

let globalLoggerConfig: LoggerConfig = {
  enabled: __DEV__ || false, // React Native compatible - disable in production
  level: LogLevel.DEBUG,
  prefix: true,
  colors: false,
};

/**
 * Configure global logger settings
 */
export function configureLogger(config: Partial<LoggerConfig>): void {
  globalLoggerConfig = { ...globalLoggerConfig, ...config };
}

/**
 * Get current logger configuration
 */
export function getLoggerConfig(): LoggerConfig {
  return { ...globalLoggerConfig };
}

/**
 * Simple logger utility for form operations
 * 
 * @example
 * ```typescript
 * const logger = new Logger('FormioForm');
 * logger.debug('Form initialized');
 * logger.warn('Invalid schema provided');
 * logger.error('Rendering failed', error);
 * ```
 */
export class Logger {
  private readonly namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  /**
   * Log debug message
   */
  debug(message: string, ...args: any[]): void {
    this._log(LogLevel.DEBUG, message, args);
  }

  /**
   * Log info message
   */
  info(message: string, ...args: any[]): void {
    this._log(LogLevel.INFO, message, args);
  }

  /**
   * Log warning message
   */
  warn(message: string, ...args: any[]): void {
    this._log(LogLevel.WARN, message, args);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | any, ...args: any[]): void {
    this._log(LogLevel.ERROR, message, [error, ...args]);
  }

  private _log(level: LogLevel, message: string, args: any[]): void {
    const config = globalLoggerConfig;

    if (!config.enabled) {
      return;
    }

    const levelPriority = { debug: 0, info: 1, warn: 2, error: 3 };
    if (levelPriority[level] < levelPriority[config.level || LogLevel.DEBUG]) {
      return;
    }

    const prefix = config.prefix ? `[${this.namespace}]` : '';
    const logFn = console.log; // Use console.log for all levels in React Native

    if (args.length > 0) {
      logFn(prefix, `[${level.toUpperCase()}]`, message, ...args);
    } else {
      logFn(prefix, `[${level.toUpperCase()}]`, message);
    }
  }
}

/**
 * Global singleton logger instance
 */
export const globalLogger = new Logger('Formio');
