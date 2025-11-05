import AudioService from '/imports/ui/components/audio/service';

const playStartRecordingSound = () => {
  AudioService.playAlertSound(`${window.meetingClientSettings.public.app.cdn
    + window.meetingClientSettings.public.app.basename}`
    + '/resources/sounds/startRecording.mp3');
};

const playStopRecordingSound = () => {
  AudioService.playAlertSound(`${window.meetingClientSettings.public.app.cdn
    + window.meetingClientSettings.public.app.basename}`
    + '/resources/sounds/stopRecording.mp3');
};

export default {
  playStartRecordingSound,
  playStopRecordingSound,
};
