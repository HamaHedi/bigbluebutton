import React, { useContext, useEffect, useRef } from 'react';
import * as PluginSdk from 'bigbluebutton-html-plugin-sdk';
import useDeduplicatedSubscription from '/imports/ui/core/hooks/useDeduplicatedSubscription';
import { MEETING_PERMISSIONS_SUBSCRIPTION } from '../queries';
import { setLocalUserList, useLoadedUserList } from '/imports/ui/core/hooks/useLoadedUserList';
import useCurrentUser from '/imports/ui/core/hooks/useCurrentUser';
import { CURRENT_PRESENTATION_PAGE_SUBSCRIPTION } from '/imports/ui/components/whiteboard/queries';
import { User } from '/imports/ui/Types/user';
import { GraphqlDataHookSubscriptionResponse } from '/imports/ui/Types/hook';
import { Meeting } from '/imports/ui/Types/meeting';
import Styled from '../styles';
import UserActions from '../user-actions/component';
import ListItem from '../list-item/component';
import { layoutSelect } from '/imports/ui/components/layout/context';
import { Layout } from '/imports/ui/components/layout/layoutTypes';
import SkeletonUserListItem from '../list-item/skeleton/component';
import { PluginsContext } from '/imports/ui/components/components-data/plugin-context/context';

interface RaiseHandUser extends User {
  raiseHandTime: string;
}

const sortUsersByRaiseHand = (users: User[], raiseHandUsers: RaiseHandUser[]) => {
  const raiseHandUserMap = new Map<string, RaiseHandUser>();
  raiseHandUsers.forEach(u => {
    if (u.userId) {
      raiseHandUserMap.set(u.userId, u);
    }
  });

  const sortedUsers = [...users].sort((a, b) => {

    const aIsMod = !!a.isModerator;
    const bIsMod = !!b.isModerator;
    if (aIsMod && !bIsMod) return -1;
    if (!aIsMod && bIsMod) return 1;


    const aRaiseHand = raiseHandUserMap.get(a.userId);
    const bRaiseHand = raiseHandUserMap.get(b.userId);

    const aHasRaiseHand  = !!aRaiseHand && aRaiseHand.raiseHandTime;
    const bHasRaiseHand = !!bRaiseHand && bRaiseHand.raiseHandTime;

    if (aHasRaiseHand && bHasRaiseHand) {
      const aTime = new Date(aRaiseHand.raiseHandTime).getTime();
      const bTime = new Date(bRaiseHand.raiseHandTime).getTime();
      return  bTime - aTime;
    }

    if (aHasRaiseHand && !bHasRaiseHand) return -1;
    if (!aHasRaiseHand && bHasRaiseHand) return 1;
    return 0;
  });

  return sortedUsers;
};

interface UserListParticipantsContainerProps {
  index: number;
  isLastItem: boolean;
  restOfUsers: number;
  setVisibleUsers: React.Dispatch<React.SetStateAction<{ [key: number]: User[]; }>>;
  raiseHandUsers: User[];
}

interface UsersListParticipantsPage {
  users: Array<User>;
  meeting: Meeting;
  currentUser: Partial<User>;
  pageId: string;
  offset: number;
}

const UsersListParticipantsPage: React.FC<UsersListParticipantsPage> = ({
  users,
  currentUser,
  meeting,
  pageId,
  offset,
}) => {
  const [openUserAction, setOpenUserAction] = React.useState<string | null>(null);
  const isRTL = layoutSelect((i: Layout) => i.isRTL);
  const { pluginsExtensibleAreasAggregatedState } = useContext(PluginsContext);
  let userListDropdownItems = [] as PluginSdk.UserListDropdownInterface[];
  if (pluginsExtensibleAreasAggregatedState.userListDropdownItems) {
    userListDropdownItems = [
      ...pluginsExtensibleAreasAggregatedState.userListDropdownItems,
    ];
  }

  return (
    <>
      {
        users.map((user, idx) => {
          return (
            <Styled.UserListItem key={user.userId} style={{ direction: isRTL }}>
              <UserActions
                user={user}
                currentUser={currentUser as User}
                lockSettings={meeting.lockSettings}
                usersPolicies={meeting.usersPolicies}
                isBreakout={meeting.isBreakout}
                pageId={pageId}
                userListDropdownItems={userListDropdownItems}
                open={user.userId === openUserAction}
                setOpenUserAction={setOpenUserAction}
              >
                <ListItem index={offset + idx} user={user} lockSettings={meeting.lockSettings} currentUser={currentUser as User} usersPolicies={meeting.usersPolicies} isBreakout={meeting.isBreakout} />
              </UserActions>
            </Styled.UserListItem>
          );
        })
      }
    </>
  );
};

const UserListParticipantsPageContainer: React.FC<UserListParticipantsContainerProps> = ({
  index,
  isLastItem,
  restOfUsers,
  setVisibleUsers,
  raiseHandUsers,
}) => {
  const offset = index * 50;
  const limit = useRef(50);

  const {
    data: meetingData,
    loading: meetingLoading,
  } = useDeduplicatedSubscription(MEETING_PERMISSIONS_SUBSCRIPTION);
  const { meeting: meetingArray } = (meetingData || {});
  const meeting = meetingArray && meetingArray[0];

  useEffect(() => () => {
    setLocalUserList([]);
  }, []);

  const {
    data: usersData,
    loading: usersLoading,
  } = useLoadedUserList({ offset, limit: limit.current }, (u) => u) as GraphqlDataHookSubscriptionResponse<Array<User>>;
  const users = sortUsersByRaiseHand(usersData ?? [], raiseHandUsers as RaiseHandUser[]) ?? [];

  const { data: currentUser, loading: currentUserLoading } = useCurrentUser((c: Partial<User>) => ({
    userId: c.userId,
    voice: c.voice,
    isModerator: c.isModerator,
    presenter: c.presenter,
    guest: c.guest,
    mobile: c.mobile,
    locked: c.locked,
    userLockSettings: c.userLockSettings,
    lastBreakoutRoom: c.lastBreakoutRoom,
    cameras: c.cameras,
    pinned: c.pinned,
    raiseHand: c.raiseHand,
    away: c.away,
    reactionEmoji: c.reactionEmoji,
    avatar: c.avatar,
    isDialIn: c.isDialIn,
    name: c.name,
    color: c.color,
    presPagesWritable: c.presPagesWritable,
  }));

  const {
    data: presentationData,
    loading: presentationLoading,
  } = useDeduplicatedSubscription(CURRENT_PRESENTATION_PAGE_SUBSCRIPTION);
  const presentationPage = presentationData?.pres_page_curr[0] || {};
  const pageId = presentationPage?.pageId;

  useEffect(() => {
    setVisibleUsers((prev) => {
      const newList = { ...prev };
      newList[index] = users;
      return newList;
    });
  }, [usersData]);

  useEffect(() => {
    return () => {
      setVisibleUsers((prev) => {
        // eslint-disable-next-line
        prev[index] = [];
        return prev;
      });
    };
  }, []);

  if (usersLoading || meetingLoading || currentUserLoading || presentationLoading) {
    return Array.from({ length: isLastItem ? restOfUsers : 50 }).map((_, i) => (
      <Styled.UserListItem key={`not-visible-item-${i + 1}`}>
        {/* eslint-disable-next-line */}
        <SkeletonUserListItem enableAnimation={true} />
      </Styled.UserListItem>
    ));
  }

  const currentUserIndex = users.findIndex((u: User) => u.userId === currentUser?.userId);

  if (currentUserIndex !== -1) {
    users.splice(currentUserIndex, 1);
  }

  if (offset === 0) {
    users.unshift(currentUser as User);
  }

  return (
    <UsersListParticipantsPage
      users={users ?? []}
      meeting={meeting ?? {}}
      currentUser={currentUser ?? {}}
      pageId={pageId}
      offset={offset}
    />
  );
};

export default UserListParticipantsPageContainer;
