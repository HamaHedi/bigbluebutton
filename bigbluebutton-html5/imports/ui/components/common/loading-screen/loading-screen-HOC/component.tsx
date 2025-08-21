import React from 'react';
import LoadingScreen from '../component';
import logger from '/imports/startup/client/logger';
import Auth from '/imports/ui/services/auth';
import { createTimeoutReporter, setLogger, setSessionInfoProvider,  } from '/imports/utils/bbb-reporter';

interface LoadingContent {
  isLoading: boolean;
}

interface LoadingContextContent extends LoadingContent {
  setLoading: (isLoading: boolean) => void;
}

export const LoadingContext = React.createContext<LoadingContextContent>({
  isLoading: false,
  setLoading: () => { },
});

interface LoadingScreenHOCProps {
  children: React.ReactNode;
}

// Configure BBBReporter with BigBlueButton's logger and session info

const LoadingScreenHOC: React.FC<LoadingScreenHOCProps> = ({
  children,
}) => {
  const [loading, setLoading] = React.useState<LoadingContent>({
    isLoading: true,
  });
  
  const reporterRef = React.useRef<ReturnType<typeof createTimeoutReporter> | null>(null);


  React.useEffect(() => {
    setLogger({
      error: (data: any, message?: string) => logger.error(data, message),
      warn: (data: any, message?: string) => logger.warn(data, message),
      info: (data: any, message?: string) => logger.info(data, message),
    });
  
    setSessionInfoProvider(() => ({
      meetingId: Auth.meetingID ? String(Auth.meetingID) : null,
      userId: Auth.userID ? String(Auth.userID) : null,
      userName: Auth.fullname ? String(Auth.fullname) : null,
      sessionToken: Auth.sessionToken ? String(Auth.sessionToken) : null,
    }));
  }, []);
  

  // Initialize reporter when component mounts
  React.useEffect(() => {
    reporterRef.current = createTimeoutReporter({
      enabled: true,
      component: 'LoadingScreenHOC',
      monitoringDelay: 0, 
      timeoutDuration: 30000, 
      logCode: 'loading_screen_timeout_error',
    });

    return () => {
      if (reporterRef.current) {
        reporterRef.current.destroy();
      }
    };
  }, []);

  React.useEffect(() => {
    if (loading.isLoading) {
      // Start the reporter
      if (reporterRef.current) {
        reporterRef.current.start({
          component: 'LoadingScreenHOC',
          loadingType: 'initial-load',
          timestamp: Date.now(),
        });
      }
    } else {
      // Stop the reporter when loading completes
      if (reporterRef.current) {
        reporterRef.current.stop();
      }
    }
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
