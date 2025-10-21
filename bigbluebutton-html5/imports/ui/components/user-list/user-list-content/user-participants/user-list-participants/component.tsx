import React, { useEffect, useState, useMemo } from 'react';

import { UI_DATA_LISTENER_SUBSCRIBED } from 'bigbluebutton-html-plugin-sdk/dist/cjs/ui-data/hooks/consts';
import { UserListUiDataPayloads } from 'bigbluebutton-html-plugin-sdk/dist/cjs/ui-data/domain/user-list/types';
import * as PluginSdk from 'bigbluebutton-html-plugin-sdk';
import { useMutation } from '@apollo/client';
import { User } from '/imports/ui/Types/user';
import Styled from './styles';
import {
  USER_AGGREGATE_COUNT_SUBSCRIPTION,
} from './queries';
import useDeduplicatedSubscription from '/imports/ui/core/hooks/useDeduplicatedSubscription';
import UserListParticipantsPageContainer from './page/component';
import IntersectionWatcher from './intersection-watcher/intersectionWatcher';
import { setLocalUserList } from '/imports/ui/core/hooks/useLoadedUserList';
import useCurrentUser from '/imports/ui/core/hooks/useCurrentUser';
import { SET_RAISE_HAND } from '/imports/ui/core/graphql/mutations/userMutations';
import { RAISED_HAND_USERS } from '/imports/ui/components/raisehand-notifier/queries';
import roveBuilder from '/imports/ui/core/utils/keyboardRove';

interface UserListParticipantsProps {
  count: number;
  searchQuery: string;
  raiseHandUsers: User[];
}

const UserListParticipants: React.FC<UserListParticipantsProps> = ({
  count,
  searchQuery,
  raiseHandUsers,
}) => {
  const [visibleUsers, setVisibleUsers] = React.useState<{
    [key: number]: User[];
  }>({});
  const userListRef = React.useRef<HTMLUListElement | null>(null);
  const selectedUserRef = React.useRef<HTMLElement | null>(null);

  const allVisibleUsers = useMemo(() => {
    const allUsers: User[] = [];
    Object.keys(visibleUsers).forEach((key) => {
      const pageUsers = visibleUsers[parseInt(key)];
      allUsers.push(...pageUsers);
    });
    return allUsers;
  }, [visibleUsers]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return allVisibleUsers;
    }

    const lowerSearchQuery = searchQuery.toLowerCase().trim();
    return allVisibleUsers.filter((user: User) => {
      return (
        user.name?.toLowerCase().includes(lowerSearchQuery) ||
        user.userId?.toLowerCase().includes(lowerSearchQuery)
      );
    });
  }, [allVisibleUsers, searchQuery]);

  // Update local user list when filtered users change
  useEffect(() => {
    setLocalUserList(filteredUsers);
  }, [filteredUsers]);

  const rove = useMemo(() => roveBuilder(selectedUserRef, 'user-index'), []);

  // --- Plugin related code ---
  useEffect(() => {
    const updateUiDataHookUserListForPlugin = () => {
      window.dispatchEvent(new CustomEvent(PluginSdk.UserListUiDataNames.USER_LIST_IS_OPEN, {
        detail: {
          value: true,
        } as UserListUiDataPayloads[PluginSdk.UserListUiDataNames.USER_LIST_IS_OPEN],
      }));
    };

    window.dispatchEvent(new CustomEvent(PluginSdk.UserListUiDataNames.USER_LIST_IS_OPEN, {
      detail: {
        value: true,
      } as UserListUiDataPayloads[PluginSdk.UserListUiDataNames.USER_LIST_IS_OPEN],
    }));
    window.addEventListener(
      `${UI_DATA_LISTENER_SUBSCRIBED}-${PluginSdk.UserListUiDataNames.USER_LIST_IS_OPEN}`,
      updateUiDataHookUserListForPlugin,
    );
    return () => {
      window.removeEventListener(
        `${UI_DATA_LISTENER_SUBSCRIBED}-${PluginSdk.UserListUiDataNames.USER_LIST_IS_OPEN}`,
        updateUiDataHookUserListForPlugin,
      );
      window.dispatchEvent(new CustomEvent(PluginSdk.UserListUiDataNames.USER_LIST_IS_OPEN, {
        detail: {
          value: false,
        } as UserListUiDataPayloads[PluginSdk.UserListUiDataNames.USER_LIST_IS_OPEN],
      }));
    };
  }, []);
  // --- End of plugin related code ---

  if (searchQuery.trim() && filteredUsers.length === 0) {
    return (
      <Styled.UserListColumn
        // @ts-ignore
        onKeyDown={rove}
        tabIndex={0}
      >
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          No users found matching "{searchQuery}"
        </div>
      </Styled.UserListColumn>
    );
  }

  if (searchQuery.trim()) {
    return (
      <Styled.UserListColumn
        onKeyDown={rove}
        tabIndex={0}
        role="list"
      >
        <Styled.VirtualizedList as="ul" ref={userListRef}>
          <UserListParticipantsPageContainer
            key="search-results"
            index={0}
            isLastItem={true}
            restOfUsers={filteredUsers.length}
            setVisibleUsers={setVisibleUsers}
            raiseHandUsers={raiseHandUsers}
            searchMode={true}
            searchResults={filteredUsers}
          />
        </Styled.VirtualizedList>
      </Styled.UserListColumn>
    );
  }


  const amountOfPages = Math.ceil(count / 50);

  return (
    <Styled.UserListColumn
      onKeyDown={rove}
      tabIndex={0}
      role="list"
    >
      <Styled.VirtualizedList as="ul" ref={userListRef}>
        {
          Array.from({ length: amountOfPages }).map((_, i) => {
            const isLastItem = amountOfPages === (i + 1);
            const restOfUsers = count % 50;
            const key = i;
            return i === 0
              ? (
                <UserListParticipantsPageContainer
                  key={key}
                  index={i}
                  isLastItem={isLastItem}
                  restOfUsers={isLastItem ? restOfUsers : 50}
                  setVisibleUsers={setVisibleUsers}
                  raiseHandUsers={raiseHandUsers}
                />
              )
              : (
                <IntersectionWatcher
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  ParentRef={userListRef}
                  isLastItem={isLastItem}
                  restOfUsers={isLastItem ? restOfUsers : 50}
                >
                  <UserListParticipantsPageContainer
                    key={key}
                    index={i}
                    isLastItem={isLastItem}
                    restOfUsers={isLastItem ? restOfUsers : 50}
                    setVisibleUsers={setVisibleUsers}
                    raiseHandUsers={raiseHandUsers}
                  />
                </IntersectionWatcher>
              );
          })
        }
      </Styled.VirtualizedList>
    </Styled.UserListColumn>
  );
};

const UserListParticipantsContainer: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery);
  const { data: currentUserData } = useCurrentUser((user) => ({
    away: user.away,
    isModerator: user.isModerator,
    userId: user.userId,
  }));
  const isModerator = currentUserData?.isModerator;

  const {
    data: countData,
  } = useDeduplicatedSubscription(USER_AGGREGATE_COUNT_SUBSCRIPTION);
  const count = countData?.user_aggregate?.aggregate?.count || 0;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setInternalSearchQuery('');
  };

  const [setRaiseHand] = useMutation(SET_RAISE_HAND);

  const lowerUserHands = (userId: string) => {
    setRaiseHand({
      variables: {
        userId,
        raiseHand: false,
      },
    });
  };

  const {
    data: usersData,
  } = useDeduplicatedSubscription(RAISED_HAND_USERS);
  const raiseHandUsers = usersData?.user || [];

  const lowerAllHands = () => {
    raiseHandUsers.forEach((user: User) => 
      lowerUserHands(user.userId)
    );
  };

  return (
    <>
      {isModerator && (
        <div>
          {raiseHandUsers.length > 0 && (
            <Styled.LowerHnads onClick={lowerAllHands}>
              <Styled.LowerHnadsTitle>Down All Hands ({raiseHandUsers.length})</Styled.LowerHnadsTitle>
            </Styled.LowerHnads>
          )}
          <div style={{ 
            position: 'relative', 
            margin: '8px 12px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="Search users..."
              value={internalSearchQuery}
              onChange={handleSearchChange}
              aria-label="Search users"
              style={{
                width: '100%',
                padding: '8px 12px',
                paddingRight: '32px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#fff',
                color: '#333',
                boxSizing: 'border-box'
              }}
            />
            {internalSearchQuery && (
              <button
                onClick={clearSearch}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: '#666',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      <UserListParticipants
        count={count ?? 0}
        searchQuery={internalSearchQuery}
        raiseHandUsers={raiseHandUsers}
      />
    </>
  );
};

export default UserListParticipantsContainer;