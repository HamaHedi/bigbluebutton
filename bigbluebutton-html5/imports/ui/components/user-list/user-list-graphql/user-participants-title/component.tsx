import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { USER_AGGREGATE_COUNT_SUBSCRIPTION } from '/imports/ui/core/graphql/queries/users';
import UserTitleOptionsContainer, { toggleMute } from './user-options-dropdown/component';
import Styled from './styles';
import useDeduplicatedSubscription from '/imports/ui/core/hooks/useDeduplicatedSubscription';
import { USER_WITH_AUDIO_AGGREGATE_COUNT_SUBSCRIPTION } from './queries';
import { Icon } from '../../../chat/chat-graphql/chat-message-list/page/chat-message/message-content/notification-content/styles';
import useWhoIsUnmuted from '/imports/ui/core/hooks/useWhoIsUnmuted';
import { SET_MUTED } from './user-options-dropdown/mutations';
import { useMutation } from '@apollo/client';
import useMeeting from '/imports/ui/core/hooks/useMeeting';
import { Meeting } from '/imports/ui/Types/meeting';
import Tooltip from '../../../common/tooltip/component';
import useCurrentUser from '/imports/ui/core/hooks/useCurrentUser';

interface UserTitleProps {
  count: number;
  countWithAudio: number;
}

const messages = defineMessages({
  usersTitle: {
    id: 'app.userList.usersTitle',
    description: 'Title for the Header',
  },
});

const UserTitle: React.FC<UserTitleProps> = ({
  count,
  countWithAudio,
}) => {
  const { data: currentUserData } = useCurrentUser((user) => ({
    presenter: user.presenter,
    isModerator: user.isModerator,
  }));
  const intl = useIntl();
  const { data: unmutedUsers } = useWhoIsUnmuted();
  const isNotAllMuted = Object.keys(unmutedUsers).length > 0;
  const [setMuted] = useMutation(SET_MUTED);
  const { data: meetingInfo } = useMeeting((meeting: Partial<Meeting>) => ({
    voiceSettings: meeting?.voiceSettings,
  }));

  const toggleMuteHandler = () => {
      toggleMute(!meetingInfo?.voiceSettings?.muteOnStart, true, setMuted);
  }

  
 
  return (
    <Styled.Container>
      <Styled.SmallTitle>
        {intl.formatMessage(messages.usersTitle)}
        <span
          data-test-users-count={count}
          data-test-users-with-audio-count={countWithAudio}
        >
          {` (${count.toLocaleString('en-US', { notation: 'standard' })})`}
        </span>
      </Styled.SmallTitle>
      {currentUserData?.isModerator && 
      <Tooltip title={"Mute All"}>
        <Styled.MuteAll onClick={toggleMuteHandler}>
          <Icon iconName="mute" className={isNotAllMuted ? 'inactive' : 'active'}/>
        </Styled.MuteAll>
      </Tooltip>}
      <UserTitleOptionsContainer />
    </Styled.Container>
  );
};

const UserTitleContainer: React.FC = () => {
  const getCountData = () => {
    const { data: countData } = useDeduplicatedSubscription(USER_AGGREGATE_COUNT_SUBSCRIPTION);
    const count = countData?.user_aggregate?.aggregate?.count || 0;
    return count;
  };

  const {
    data: audioUsersCountData,
  } = useDeduplicatedSubscription(USER_WITH_AUDIO_AGGREGATE_COUNT_SUBSCRIPTION);

  const countWithAudio = audioUsersCountData?.user_aggregate?.aggregate?.count || 0;
  return (
    <UserTitle
      count={getCountData() as number}
      countWithAudio={countWithAudio}
    />
  );
};

export default UserTitleContainer;
