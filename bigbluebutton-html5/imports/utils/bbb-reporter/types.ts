export interface SessionInfo {
  meetingId: string | null;
  userId: string | null;
  userName: string | null;
  sessionToken: string | null;
}

export interface PerformanceMetrics {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  timing?: PerformanceTiming;
}

export interface ErrorReport {
  timestamp: number;
  duration?: number;
  userAgent: string;
  url: string;
  sessionInfo: SessionInfo;
  performanceMetrics: PerformanceMetrics;
  consoleErrors: string[];
  networkRequests: string[];
  customData?: Record<string, any>;
}

export interface ReporterConfig {
  enabled: boolean;
  monitoringDelay?: number; // Delay before starting monitoring (ms)
  timeoutDuration?: number; // Timeout before sending report (ms)
  maxConsoleErrors?: number; // Max console errors to collect
  maxNetworkRequests?: number; // Max network requests to collect
  logCode?: string; // Custom log code for the report
  component?: string; // Component name for context
}

export interface TimeoutReporterOptions extends ReporterConfig {
  onTimeout?: (report: ErrorReport) => void;
  onStart?: () => void;
  onStop?: () => void;
}

export interface ErrorReporterOptions extends ReporterConfig {
  onError?: (error: Error, report: ErrorReport) => void;
  errorTypes?: string[]; // Types of errors to monitor
}

export interface PerformanceReporterOptions extends ReporterConfig {
  onPerformanceIssue?: (report: ErrorReport) => void;
  thresholds?: {
    memoryUsage?: number; // MB
    loadTime?: number; // ms
  };
}
