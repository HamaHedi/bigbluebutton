import React from 'react';
import LoadingScreen from '../component';
import logger from '/imports/startup/client/logger';
import Auth from '/imports/ui/services/auth';

interface LoadingContent {
  isLoading: boolean;
}

interface LoadingContextContent extends LoadingContent {
  setLoading: (isLoading: boolean) => void;
}

interface ErrorReport {
  timestamp: number;
  loadingDuration: number;
  userAgent: string;
  url: string;
  sessionInfo: {
    meetingId: string | null;
    userId: string | null;
    userName: string | null;
    sessionToken: string | null;
  };
  performanceMetrics: {
    memory?: any;
    timing?: PerformanceTiming;
  };
  consoleErrors: string[];
  networkRequests: string[];
}

export const LoadingContext = React.createContext<LoadingContextContent>({
  isLoading: false,
  setLoading: () => { },
});

interface LoadingScreenHOCProps {
  children: React.ReactNode;
}

const LoadingScreenHOC: React.FC<LoadingScreenHOCProps> = ({
  children,
}) => {
  const [loading, setLoading] = React.useState<LoadingContent>({
    isLoading: false,
  });
  
  const loadingStartTimeRef = React.useRef<number | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const consoleErrorsRef = React.useRef<string[]>([]);
  const networkRequestsRef = React.useRef<string[]>([]);

  // Collect console errors
  React.useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args: any[]) => {
      consoleErrorsRef.current.push(`ERROR: ${args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')}`);
      originalError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      consoleErrorsRef.current.push(`WARN: ${args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')}`);
      originalWarn.apply(console, args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  // Collect network requests
  React.useEffect(() => {
    const originalFetch = window.fetch;
    const originalXHROpen = XMLHttpRequest.prototype.open;

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const [url] = args;
      networkRequestsRef.current.push(`FETCH: ${url}`);
      return originalFetch.apply(window, args);
    };

    XMLHttpRequest.prototype.open = function(method: string, url: string | URL) {
      networkRequestsRef.current.push(`XHR: ${method} ${url}`);
      return originalXHROpen.apply(this, arguments as any);
    };

    return () => {
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXHROpen;
    };
  }, []);

  const collectErrorReport = (): ErrorReport => {
    const now = Date.now();
    const loadingDuration = loadingStartTimeRef.current ? now - loadingStartTimeRef.current : 0;

    return {
      timestamp: now,
      loadingDuration,
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionInfo: {
        meetingId: Auth.meetingID ? String(Auth.meetingID) : null,
        userId: Auth.userID ? String(Auth.userID) : null,
        userName: Auth.fullname ? String(Auth.fullname) : null,
        sessionToken: Auth.sessionToken ? String(Auth.sessionToken) : null,
      },
      performanceMetrics: {
        memory: (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        } : undefined,
        timing: performance.timing,
      },
      consoleErrors: [...consoleErrorsRef.current],
      networkRequests: [...networkRequestsRef.current],
    };
  };

  const sendErrorReport = async (errorReport: ErrorReport) => {
    try {
      logger.error({
        logCode: 'loading_screen_timeout_error',
        extraInfo: {
          errorReport,
          errorType: 'LoadingTimeout',
          component: 'LoadingScreenHOC',
        },
      }, `Loading screen stuck for ${Math.round(errorReport.loadingDuration / 1000)} seconds`);

      // Also log individual components for better searchability
      logger.warn({
        logCode: 'loading_screen_performance_data',
        extraInfo: {
          loadingDuration: errorReport.loadingDuration,
          memoryUsage: errorReport.performanceMetrics.memory,
          sessionInfo: errorReport.sessionInfo,
        },
      }, 'Loading screen performance metrics');

      if (errorReport.consoleErrors.length > 0) {
        logger.error({
          logCode: 'loading_screen_console_errors',
          extraInfo: {
            errors: errorReport.consoleErrors.slice(-20), // Last 20 errors
            totalErrorCount: errorReport.consoleErrors.length,
          },
        }, `${errorReport.consoleErrors.length} console errors during loading`);
      }

      if (errorReport.networkRequests.length > 0) {
        logger.info({
          logCode: 'loading_screen_network_requests',
          extraInfo: {
            requests: errorReport.networkRequests.slice(-50), // Last 50 requests
            totalRequestCount: errorReport.networkRequests.length,
          },
        }, `${errorReport.networkRequests.length} network requests during loading`);
      }

    } catch (error) {
      console.error('Failed to send error report:', error);
    }
  };

  React.useEffect(() => {
    if (loading.isLoading) {
      // Start tracking loading time
      loadingStartTimeRef.current = Date.now();
      
      // Clear previous logs
      consoleErrorsRef.current = [];
      networkRequestsRef.current = [];

      // Set timeout for 60 seconds
      timeoutRef.current = setTimeout(() => {
        const errorReport = collectErrorReport();
        sendErrorReport(errorReport);
      }, 60000); // 60 seconds

    } else {
      // Clear timeout when loading stops
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      loadingStartTimeRef.current = null;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loading.isLoading]);

  return (
    <LoadingContext.Provider value={{
      isLoading: loading.isLoading,
      setLoading: (isLoading: boolean) => {
        // setLoading({
        //   isLoading,
        // });
      },
    }}
    >
      {
        loading.isLoading
          ? (
            <LoadingScreen />
          )
          : null
      }
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingScreenHOC;
