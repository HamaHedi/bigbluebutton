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
import Tooltip from '../../../common/tooltip/component';
import useCurrentUser from '/imports/ui/core/hooks/useCurrentUser';
import useMeeting from '/imports/ui/core/hooks/useMeeting';
import { User } from '/imports/ui/Types/user';
import { Meeting } from '/imports/ui/Types/meeting';

interface UserTitleProps {
  count: number;
  countWithAudio: number;
  hideUserList?: boolean;
}

const messages = defineMessages({
  usersTitle: {
    id: 'app.userList.usersTitle',
    description: 'Title for the Header',
  },
  lockedUsersTitle: {
    id: 'app.userList.lockedUsersTitle',
    description: 'Title for the locked users',
  },
});

const UserTitle: React.FC<UserTitleProps> = ({
  count,
  countWithAudio,
  hideUserList,
}) => {
  const { data: currentUserData } = useCurrentUser((user) => ({
    presenter: user.presenter,
    isModerator: user.isModerator,
  }));
  const intl = useIntl();
  const { data: unmutedUsers } = useWhoIsUnmuted();
  const isNotAllMuted = Object.keys(unmutedUsers).length > 1;
  const [setMuted] = useMutation(SET_MUTED);
  const { data: meetingInfo } = useMeeting((meeting: Partial<Meeting>) => ({
    voiceSettings: meeting?.voiceSettings,
  }));

  const toggleMuteHandler = () => {
    const isMeetingMuted = meetingInfo?.voiceSettings?.muteOnStart;
    toggleMute(!isMeetingMuted, false, setMuted);
    toggleMute(!!isMeetingMuted, true, setMuted);
  }



  const userListLabel = hideUserList ? messages.lockedUsersTitle : messages.usersTitle;

  console.log({ currentUserData })

  return (
    <Styled.Container>
      <Styled.SmallTitle>
        <span
          data-test-users-count={count}
          data-test-users-with-audio-count={countWithAudio}
        >
          {intl.formatMessage(
            userListLabel,
            {
              userCount: currentUserData?.isModerator ? count.toLocaleString('en-US', { notation: 'standard' }) : 2,
            },
          )}
        </span>
      </Styled.SmallTitle>
      {currentUserData?.isModerator &&
        <Tooltip title={"Mute All except presenter"}>
          <Styled.MuteAll onClick={toggleMuteHandler}>
            <Icon iconName="mute" className={isNotAllMuted ? 'inactive' : 'active'} />
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

  const { data: currentUser } = useCurrentUser((u: Partial<User>) => ({
    locked: u?.locked ?? false,
  }));

  const { data: currentMeeting } = useMeeting((m: Partial<Meeting>) => ({
    lockSettings: m.lockSettings,
  }));

  const hideUserList = currentUser?.locked && currentMeeting?.lockSettings?.hideUserList;

  return (
    <UserTitle
      count={getCountData() as number}
      countWithAudio={countWithAudio}
      hideUserList={hideUserList}
    />
  );
};

export default UserTitleContainer;
