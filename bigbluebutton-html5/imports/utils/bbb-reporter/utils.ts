import { SessionInfo, PerformanceMetrics, ErrorReport } from './types';

// Default session info getter (can be overridden)
let getSessionInfo: () => SessionInfo = () => ({
  meetingId: null,
  userId: null,
  userName: null,
  sessionToken: null,
});

// Default logger interface (can be overridden)
interface Logger {
  error: (data: any, message?: string) => void;
  warn: (data: any, message?: string) => void;
  info: (data: any, message?: string) => void;
}

let logger: Logger = {
  error: (data, message) => console.error(message || 'Error:', data),
  warn: (data, message) => console.warn(message || 'Warning:', data),
  info: (data, message) => console.info(message || 'Info:', data),
};

export const setSessionInfoProvider = (provider: () => SessionInfo) => {
  getSessionInfo = provider;
};

export const setLogger = (customLogger: Logger) => {
  logger = customLogger;
};

export const getLogger = () => logger;

export const collectSessionInfo = (): SessionInfo => {
  try {
    return getSessionInfo();
  } catch (error) {
    console.warn('Failed to collect session info:', error);
    return {
      meetingId: null,
      userId: null,
      userName: null,
      sessionToken: null,
    };
  }
};

export const collectPerformanceMetrics = (): PerformanceMetrics => {
  const metrics: PerformanceMetrics = {};

  try {
    // Collect memory information if available
    if ((performance as any).memory) {
      metrics.memory = {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      };
    }

    // Collect timing information
    if (performance.timing) {
      metrics.timing = performance.timing;
    }
  } catch (error) {
    console.warn('Failed to collect performance metrics:', error);
  }

  return metrics;
};

export const createBaseErrorReport = (customData?: Record<string, any>): Omit<ErrorReport, 'duration'> => {
  return {
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    sessionInfo: collectSessionInfo(),
    performanceMetrics: collectPerformanceMetrics(),
    consoleErrors: [],
    networkRequests: [],
    customData,
  };
};

export const formatErrorMessage = (args: any[]): string => {
  return args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');
};

export const safeStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    return String(obj);
  }
};
