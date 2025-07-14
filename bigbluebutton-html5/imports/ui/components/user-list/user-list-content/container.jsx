import React from 'react';
import UserContent from './component';
import useCurrentUser from '/imports/ui/core/hooks/useCurrentUser';
import useMeeting from '/imports/ui/core/hooks/useMeeting';
import { useIsChatEnabled } from '/imports/ui/services/features';

const ASK_MODERATOR = 'ASK_MODERATOR';

const UserContentContainer = (props) => {
  const { data: currentUser } = useCurrentUser((user) => ({
    userId: user.userId,
    presenter: user.presenter,
    locked: user.locked,
    role: user.role,
    isModerator: user.isModerator,
  }));

  const {
    data: currentMeeting,
  } = useMeeting((m) => ({
    componentsFlags: m.componentsFlags,
    usersPolicies: {
      guestPolicy: m.usersPolicies.guestPolicy,
    },
  }));
  const isChatEnabled = useIsChatEnabled();

  const APP_SETTINGS = window.meetingClientSettings.public.app;
  const isWaitingRoomEnabled = currentMeeting?.usersPolicies?.guestPolicy === ASK_MODERATOR;

  return (
    <UserContent
      {...{
        isGuestLobbyMessageEnabled: APP_SETTINGS.enableGuestLobbyMessage,
        currentUser,
        isTimerActive: currentMeeting?.componentsFlags?.hasTimer && currentUser?.isModerator,
        isWaitingRoomEnabled,
        isChatEnabled,
        ...props,
      }}
    />
  );
};

export default UserContentContainer;

// Example styled components for the search input
// Add these to your existing styles file
const SearchContainer = styled.div`
  position: relative;
  margin: 8px 12px;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  padding-right: 32px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 4px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.palette.background.default};
  color: ${({ theme }) => theme.palette.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.palette.primary.main};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.palette.primary.main}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: ${({ theme }) => theme.palette.text.secondary};
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

// Add these to your Styled object
export default {
  // ... your existing styles
  SearchContainer,
  SearchInput,
  ClearButton,
};