import BBBReporter from './BBBReporter';
import { TimeoutReporterOptions, ErrorReporterOptions, PerformanceReporterOptions } from './types';

/**
 * Creates a timeout reporter for monitoring operations that take too long
 * 
 * @example
 * ```typescript
 * const reporter = createTimeoutReporter({
 *   component: 'LoadingScreen',
 *   timeoutDuration: 60000, // 60 seconds
 *   onTimeout: (report) => console.log('Timeout detected!', report)
 * });
 * 
 * // Start monitoring
 * reporter.start({ operationType: 'initial-load' });
 * 
 * // Stop when operation completes
 * reporter.stop();
 * ```
 */
export const createTimeoutReporter = (options: TimeoutReporterOptions) => {
  const reporter = new BBBReporter({
    enabled: options.enabled ?? true,
    monitoringDelay: options.monitoringDelay ?? 30000,
    timeoutDuration: options.timeoutDuration ?? 60000,
    maxConsoleErrors: options.maxConsoleErrors ?? 20,
    maxNetworkRequests: options.maxNetworkRequests ?? 50,
    logCode: options.logCode ?? 'timeout_reporter',
    component: options.component ?? 'TimeoutReporter',
  });

  let originalStart = reporter.start.bind(reporter);
  let originalStop = reporter.stop.bind(reporter);

  // Override start to add custom callback
  reporter.start = (customData?: Record<string, any>) => {
    options.onStart?.();
    return originalStart(customData);
  };

  // Override stop to add custom callback
  reporter.stop = () => {
    options.onStop?.();
    return originalStop();
  };

  return reporter;
};

/**
 * Creates an error reporter for monitoring and reporting specific errors
 * 
 * @example
 * ```typescript
 * const reporter = createErrorReporter({
 *   component: 'GraphQLClient',
 *   errorTypes: ['NetworkError', 'GraphQLError'],
 *   onError: (error, report) => console.log('Error detected:', error)
 * });
 * 
 * try {
 *   // Some operation
 * } catch (error) {
 *   reporter.reportError(error, { operation: 'fetchData' });
 * }
 * ```
 */
export const createErrorReporter = (options: ErrorReporterOptions) => {
  const reporter = new BBBReporter({
    enabled: options.enabled ?? true,
    monitoringDelay: options.monitoringDelay ?? 0, // Start monitoring immediately for errors
    timeoutDuration: options.timeoutDuration ?? Infinity, // No automatic timeout
    maxConsoleErrors: options.maxConsoleErrors ?? 20,
    maxNetworkRequests: options.maxNetworkRequests ?? 50,
    logCode: options.logCode ?? 'error_reporter',
    component: options.component ?? 'ErrorReporter',
  });

  let originalReportError = reporter.reportError.bind(reporter);

  // Override reportError to add filtering and custom callback
  reporter.reportError = (error: Error, customData?: Record<string, any>) => {
    // Filter by error types if specified
    if (options.errorTypes && options.errorTypes.length > 0) {
      const matchesType = options.errorTypes.some(type => 
        error.name === type || error.message.includes(type)
      );
      if (!matchesType) return;
    }

    const report = (reporter as any).generateReport(customData);
    options.onError?.(error, report);
    
    return originalReportError(error, customData);
  };

  return reporter;
};

/**
 * Creates a performance reporter for monitoring performance metrics
 * 
 * @example
 * ```typescript
 * const reporter = createPerformanceReporter({
 *   component: 'VideoRenderer',
 *   thresholds: {
 *     memoryUsage: 100, // MB
 *     loadTime: 5000    // 5 seconds
 *   },
 *   onPerformanceIssue: (report) => console.log('Performance issue!', report)
 * });
 * 
 * reporter.start({ renderType: 'webcam' });
 * ```
 */
export const createPerformanceReporter = (options: PerformanceReporterOptions) => {
  const reporter = new BBBReporter({
    enabled: options.enabled ?? true,
    monitoringDelay: options.monitoringDelay ?? 5000, // Start monitoring after 5 seconds
    timeoutDuration: options.timeoutDuration ?? 30000, // Check performance after 30 seconds
    maxConsoleErrors: options.maxConsoleErrors ?? 10,
    maxNetworkRequests: options.maxNetworkRequests ?? 20,
    logCode: options.logCode ?? 'performance_reporter',
    component: options.component ?? 'PerformanceReporter',
  });

  // Add performance monitoring
  const checkPerformance = () => {
    if (!reporter.isActive) return;

    const report = (reporter as any).generateReport();
    let hasIssue = false;

    // Check memory threshold
    if (options.thresholds?.memoryUsage && report.performanceMetrics.memory) {
      const memoryMB = report.performanceMetrics.memory.usedJSHeapSize / 1024 / 1024;
      if (memoryMB > options.thresholds.memoryUsage) {
        hasIssue = true;
      }
    }

    // Check load time threshold
    if (options.thresholds?.loadTime && report.duration && report.duration > options.thresholds.loadTime) {
      hasIssue = true;
    }

    if (hasIssue) {
      options.onPerformanceIssue?.(report);
      reporter.reportCustom({ performanceIssue: true }, 'warn');
    }
  };

  let originalStart = reporter.start.bind(reporter);

  // Override start to add performance monitoring
  reporter.start = (customData?: Record<string, any>) => {
    originalStart(customData);
    
    // Set up periodic performance checks
    const performanceInterval = setInterval(checkPerformance, 10000); // Check every 10 seconds
    
    // Clean up on stop
    const originalStop = reporter.stop.bind(reporter);
    reporter.stop = () => {
      clearInterval(performanceInterval);
      return originalStop();
    };
  };

  return reporter;
};

/**
 * Simple one-call reporter for quick error reporting anywhere in the project
 * 
 * @example
 * ```typescript
 * import { quickReport } from '/imports/utils/bbb-reporter';
 * 
 * // Report an error
 * quickReport.error(new Error('Something went wrong'), {
 *   component: 'ChatComponent',
 *   action: 'sendMessage'
 * });
 * 
 * // Report a warning
 * quickReport.warn('Slow operation detected', {
 *   component: 'VideoRenderer',
 *   duration: 5000
 * });
 * 
 * // Report info
 * quickReport.info('User action completed', {
 *   component: 'Whiteboard',
 *   action: 'draw'
 * });
 * ```
 */
export const quickReport = {
  error: (error: Error | string, data?: Record<string, any>) => {
    const reporter = new BBBReporter({
      enabled: true,
      monitoringDelay: 0,
      timeoutDuration: Infinity,
      logCode: 'quick_report_error',
      component: data?.component || 'QuickReport',
    });

    if (typeof error === 'string') {
      reporter.reportCustom({ errorMessage: error, ...data }, 'error');
    } else {
      reporter.reportError(error, data);
    }

    reporter.destroy();
  },

  warn: (message: string, data?: Record<string, any>) => {
    const reporter = new BBBReporter({
      enabled: true,
      monitoringDelay: 0,
      timeoutDuration: Infinity,
      logCode: 'quick_report_warning',
      component: data?.component || 'QuickReport',
    });

    reporter.reportCustom({ warningMessage: message, ...data }, 'warn');
    reporter.destroy();
  },

  info: (message: string, data?: Record<string, any>) => {
    const reporter = new BBBReporter({
      enabled: true,
      monitoringDelay: 0,
      timeoutDuration: Infinity,
      logCode: 'quick_report_info',
      component: data?.component || 'QuickReport',
    });

    reporter.reportCustom({ infoMessage: message, ...data }, 'info');
    reporter.destroy();
  },

  timeout: (component: string, duration: number, data?: Record<string, any>) => {
    const reporter = createTimeoutReporter({
      enabled: true,
      component,
      timeoutDuration: duration,
      logCode: 'quick_timeout_report',
    });

    reporter.start(data);
    return () => reporter.stop();
  },
};
