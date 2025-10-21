import { MonitoringManager } from './MonitoringManager';
import { createBaseErrorReport, getLogger } from './utils';
import { ErrorReport, ReporterConfig } from './types';

const PROJECT_NAME = 'takiacademy';
const API_URL = `https://8efb48d25b9d.ngrok-free.app/api/bbb-reporter?project=${PROJECT_NAME}`;

export default class BBBReporter {
  private config: Required<ReporterConfig>;
  private monitoring: MonitoringManager;
  private consoleErrors: string[] = [];
  private networkRequests: string[] = [];
  private startTime: number | null = null;
  private timeouts: {
    monitoring?: ReturnType<typeof setTimeout>;
    reporting?: ReturnType<typeof setTimeout>;
  } = {};

  constructor(config: ReporterConfig) {
    this.config = {
      enabled: true,
      monitoringDelay: 5000, // 5 seconds
      timeoutDuration: 60000, // 60 seconds
      maxConsoleErrors: 20,
      maxNetworkRequests: 50,
      logCode: 'bbb_reporter_error',
      component: 'BBBReporter',
      ...config,
    };

    this.monitoring = new MonitoringManager({
      onConsoleError: (message) => {
        this.consoleErrors.push(message);
        if (this.consoleErrors.length > this.config.maxConsoleErrors) {
          this.consoleErrors.shift(); // Remove oldest
        }
      },
      onConsoleWarn: (message) => {
        this.consoleErrors.push(message);
        if (this.consoleErrors.length > this.config.maxConsoleErrors) {
          this.consoleErrors.shift();
        }
      },
      onNetworkRequest: (request) => {
        this.networkRequests.push(request);
        if (this.networkRequests.length > this.config.maxNetworkRequests) {
          this.networkRequests.shift(); // Remove oldest
        }
      },
    });
  }

  start(customData?: Record<string, any>) {
    if (!this.config.enabled) return;

    this.startTime = Date.now();
    this.clearData();

    // Start monitoring after delay
    if (this.config.monitoringDelay > 0) {
      this.timeouts.monitoring = setTimeout(() => {
        this.monitoring.enable();
      }, this.config.monitoringDelay);
    } else {
      this.monitoring.enable();
    }

    // Set timeout for automatic reporting
    this.timeouts.reporting = setTimeout(() => {
      const report = this.generateReport(customData);
      this.sendReport(report);
    }, this.config.timeoutDuration);
  }

  stop() {
    // Clear timeouts
    if (this.timeouts.monitoring) {
      clearTimeout(this.timeouts.monitoring);
      delete this.timeouts.monitoring;
    }
    if (this.timeouts.reporting) {
      clearTimeout(this.timeouts.reporting);
      delete this.timeouts.reporting;
    }

    // Disable monitoring
    this.monitoring.disable();
    
    // Clear data
    this.clearData();
    this.startTime = null;
  }

  reportError(error: Error, customData?: Record<string, any>) {
    if (!this.config.enabled) return;

    const report = this.generateReport({
      ...customData,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });

    this.sendReport(report, 'error');
  }

  reportCustom(data: Record<string, any>, logLevel: 'error' | 'warn' | 'info' = 'info') {
    if (!this.config.enabled) return;

    const report = this.generateReport(data);
    this.sendReport(report, logLevel);
  }

  private generateReport(customData?: Record<string, any>): ErrorReport {
    const baseReport = createBaseErrorReport(customData);
    const duration = this.startTime ? Date.now() - this.startTime : 0;

    return {
      ...baseReport,
      duration,
      consoleErrors: [...this.consoleErrors],
      networkRequests: [...this.networkRequests],
    };
  }

  private sendReport(report: ErrorReport, logLevel: 'error' | 'warn' | 'info' = 'error') {
    try {
      const logger = getLogger();
      const logData = {
        logCode: this.config.logCode,
        extraInfo: {
          errorReport: report,
          component: this.config.component,
          reportType: logLevel,
        },
      };

      const message = report.duration 
        ? `${this.config.component} issue detected after ${Math.round(report.duration / 1000)} seconds`
        : `${this.config.component} error reported`;

      switch (logLevel) {
        case 'error':
          logger.error(logData, message);
          break;
        case 'warn':
          logger.warn(logData, message);
          break;
        case 'info':
          logger.info(logData, message);
          break;
      }

      // fetch(API_URL, {
      //   method: 'POST',
      //   body: JSON.stringify(logData),
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });

    } catch (error) {
      console.error('Failed to send BBB report:', error);
    }
  }

  private clearData() {
    this.consoleErrors = [];
    this.networkRequests = [];
  }

  destroy() {
    this.stop();
    this.monitoring.destroy();
  }

  // Getters for status
  get isActive() {
    return this.startTime !== null;
  }

  get isMonitoring() {
    return this.monitoring.isMonitoring();
  }

  get duration() {
    return this.startTime ? Date.now() - this.startTime : 0;
  }
}
