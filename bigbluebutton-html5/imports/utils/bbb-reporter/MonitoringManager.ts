import { formatErrorMessage } from './utils';

export interface MonitoringCallbacks {
  onConsoleError?: (message: string) => void;
  onConsoleWarn?: (message: string) => void;
  onNetworkRequest?: (request: string) => void;
}

export class MonitoringManager {
  private isEnabled = false;
  private originalFunctions: {
    error: typeof console.error;
    warn: typeof console.warn;
    fetch: typeof window.fetch;
    xhrOpen: typeof XMLHttpRequest.prototype.open;
  } | null = null;

  private callbacks: MonitoringCallbacks = {};

  constructor(callbacks?: MonitoringCallbacks) {
    this.callbacks = callbacks || {};
    this.storeOriginalFunctions();
  }

  private storeOriginalFunctions() {
    this.originalFunctions = {
      error: console.error,
      warn: console.warn,
      fetch: window.fetch,
      xhrOpen: XMLHttpRequest.prototype.open,
    };
  }

  enable() {
    if (this.isEnabled || !this.originalFunctions) return;
    
    this.isEnabled = true;
    
    // Override console methods
    console.error = (...args: any[]) => {
      const message = `ERROR: ${formatErrorMessage(args)}`;
      this.callbacks.onConsoleError?.(message);
      this.originalFunctions!.error.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      const message = `WARN: ${formatErrorMessage(args)}`;
      this.callbacks.onConsoleWarn?.(message);
      this.originalFunctions!.warn.apply(console, args);
    };

    // Override network methods
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const [url] = args;
      const request = `FETCH: ${url}`;
      this.callbacks.onNetworkRequest?.(request);
      return this.originalFunctions!.fetch.apply(window, args);
    };

    XMLHttpRequest.prototype.open = function(method: string, url: string | URL) {
      const request = `XHR: ${method} ${url}`;
      this.callbacks.onNetworkRequest?.(request);
      return this.originalFunctions!.xhrOpen.apply(this, arguments as any);
    };
  }

  disable() {
    if (!this.isEnabled || !this.originalFunctions) return;
    
    this.isEnabled = false;
    
    // Restore original functions
    console.error = this.originalFunctions.error;
    console.warn = this.originalFunctions.warn;
    window.fetch = this.originalFunctions.fetch;
    XMLHttpRequest.prototype.open = this.originalFunctions.xhrOpen;
  }

  isMonitoring() {
    return this.isEnabled;
  }

  destroy() {
    this.disable();
    this.originalFunctions = null;
  }
}
