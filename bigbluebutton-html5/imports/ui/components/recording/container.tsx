import React, { useEffect, useRef } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import RecordingComponent from './component';
import { SET_RECORDING_STATUS } from './mutations';
import { GetRecordingResponse, GetRecordingPoliciesResponse } from './queries';
import useDeduplicatedSubscription from '/imports/ui/core/hooks/useDeduplicatedSubscription';
import ConnectionStatus from '/imports/ui/core/graphql/singletons/connectionStatus';
import { GET_MEETING_RECORDING_DATA, GET_MEETING_RECORDING_POLICIES } from '/imports/ui/components/nav-bar/nav-bar-graphql/recording-indicator/queries';
import Service from '/imports/ui/components/nav-bar/nav-bar-graphql/recording-indicator/service';

interface RecordingContainerProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  amIModerator: boolean;
  onRequestClose: () => void;
  priority: string;
  isOpen: boolean;
}

const RecordingContainer: React.FC<RecordingContainerProps> = (props) => {
  const {
    amIModerator, isOpen, onRequestClose, priority, setIsOpen,
  } = props;
  const [setRecordingStatus] = useMutation(SET_RECORDING_STATUS);
  const connected = useReactiveVar(ConnectionStatus.getConnectedStatusVar());
  const autoStopTimerRef = useRef<any>(null);

  const {
    data: recordingData,
  } = useDeduplicatedSubscription<GetRecordingResponse>(GET_MEETING_RECORDING_DATA);

  const {
    data: recordingPoliciesData,
  } = useDeduplicatedSubscription<GetRecordingPoliciesResponse>(GET_MEETING_RECORDING_POLICIES);

  const recording = recordingData?.meeting_recording[0]?.isRecording ?? false;
  const time = recordingData?.meeting_recording[0]?.previousRecordedTimeInSeconds ?? 0;
  const allowStartStopRecording = recordingPoliciesData?.meeting_recordingPolicies[0]?.allowStartStopRecording ?? false;

  // Auto-stop recording after 1 minute
  useEffect(() => {
    console.log("in herrrerrerererererre")
    if (recording) {
      // Clear any existing timer
      if (autoStopTimerRef.current) {
        clearTimeout(autoStopTimerRef.current);
      }
      
      // Set timer to stop recording after 1 minute (60000 ms)
      autoStopTimerRef.current = setTimeout(() => {
        setRecordingStatus({
          variables: {
            recording: false,
          },
        });
        setIsOpen(false);
      }, 60000);
    } else {
      // Clear timer if recording is stopped manually
      if (autoStopTimerRef.current) {
        clearTimeout(autoStopTimerRef.current);
        autoStopTimerRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (autoStopTimerRef.current) {
        clearTimeout(autoStopTimerRef.current);
        autoStopTimerRef.current = null;
      }
    };
  }, [recording, setRecordingStatus, setIsOpen]);

  const toggleRecording = () => {
    setRecordingStatus({
      variables: {
        recording: !recording,
      },
    });
    setIsOpen(false);
  };

  const mayIRecord = Service.mayIRecord(amIModerator, allowStartStopRecording);

  if (!mayIRecord) return null;

  return (
    <RecordingComponent
      {...{
        connected,
        isOpen,
        onRequestClose,
        priority,
        recordingTime: time,
        recordingStatus: recording,
        setIsOpen,
        toggleRecording,
      }}
    />
  );
};

export default RecordingContainer;