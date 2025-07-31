import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { debounce } from '/imports/utils/debounce';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import Styled from './styles';
import UserAvatar from '/imports/ui/components/user-avatar/component';
import { ACTIONS, PANELS } from '../../layout/enums';
import Icon from '/imports/ui/components/common/icon/component';

const OpenInNewTabIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="open-in-new-tab-outline"><g fill="#4e5a66" fill-rule="evenodd" class="Vector" clip-rule="evenodd"><path d="M5 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5.263a1 1 0 1 1 2 0V19a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h5.017a1 1 0 1 1 0 2z"/><path d="M21.411 2.572a.963.963 0 0 1 0 1.36l-8.772 8.786a.96.96 0 0 1-1.358 0a.963.963 0 0 1 0-1.36l8.773-8.786a.96.96 0 0 1 1.357 0"/><path d="M21.04 2c.53 0 .96.43.96.962V8c0 .531-.47 1-1 1s-1-.469-1-1V4h-4c-.53 0-1-.469-1-1s.43-1 .96-1z"/></g></g></svg>
  );
};

const DEBOUNCE_TIME = 1000;

let globalAppplyStateToProps = () => {};

const throttledFunc = debounce(() => {
  globalAppplyStateToProps();
}, DEBOUNCE_TIME, { trailing: true, leading: true });

const intlMessages = defineMessages({
  titlePublic: {
    id: 'app.chat.titlePublic',
    description: 'title for public chat',
  },
  unreadPlural: {
    id: 'app.userList.chatListItem.unreadPlural',
    description: 'singular aria label for new message',
  },
  unreadSingular: {
    id: 'app.userList.chatListItem.unreadSingular',
    description: 'plural aria label for new messages',
  },
});

const propTypes = {
  chat: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    unreadCounter: PropTypes.number.isRequired,
  }).isRequired,
  idChatOpen: PropTypes.string.isRequired,
  compact: PropTypes.bool.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  tabIndex: PropTypes.number,
  isPublicChat: PropTypes.func.isRequired,
  shortcuts: PropTypes.string,
};

const ChatListItem = ({
  chat,
  activeChatId,
  idChatOpen,
  compact,
  intl,
  tabIndex = -1,
  isPublicChat,
  shortcuts = '',
  sidebarContentIsOpen,
  sidebarContentPanel,
  layoutContextDispatch,
}) => {
  const TOGGLE_CHAT_PUB_AK = shortcuts;
  const CHAT_CONFIG = window.meetingClientSettings.public.chat;
  const PUBLIC_CHAT_KEY = CHAT_CONFIG.public_id;

  const chatPanelOpen = sidebarContentIsOpen && sidebarContentPanel === PANELS.CHAT;

  const isCurrentChat = chat.chatId === activeChatId && chatPanelOpen;

  const [stateUreadCount, setStateUreadCount] = useState(0);

  if (chat.unreadCounter !== stateUreadCount && (stateUreadCount < chat.unreadCounter)) {
    globalAppplyStateToProps = () => {
      setStateUreadCount(chat.unreadCounter);
    };
    throttledFunc();
  } else if (chat.unreadCounter !== stateUreadCount && (stateUreadCount > chat.unreadCounter)) {
    setStateUreadCount(chat.unreadCounter);
  }


  useEffect(() => {
    if (chat.userId !== PUBLIC_CHAT_KEY && chat.userId === idChatOpen) {
      layoutContextDispatch({
        type: ACTIONS.SET_ID_CHAT_OPEN,
        value: chat.chatId,
      });
    }
  }, [idChatOpen, sidebarContentIsOpen, sidebarContentPanel, chat]);

  const handleClickToggleChat = () => {
    // Verify if chat panel is open

    if (sidebarContentIsOpen && sidebarContentPanel === PANELS.CHAT) {
      if (idChatOpen === chat.chatId) {
        layoutContextDispatch({
          type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
          value: false,
        });
        layoutContextDispatch({
          type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
          value: PANELS.NONE,
        });
        layoutContextDispatch({
          type: ACTIONS.SET_ID_CHAT_OPEN,
          value: '',
        });
      } else {
        layoutContextDispatch({
          type: ACTIONS.SET_ID_CHAT_OPEN,
          value: chat.chatId,
        });
      }
    } else {
      layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
        value: true,
      });
      layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
        value: PANELS.CHAT,
      });
      layoutContextDispatch({
        type: ACTIONS.SET_ID_CHAT_OPEN,
        value: chat.chatId,
      });
    }
  };

  const openChatModal = (e) => {
    e.stopPropagation();
    layoutContextDispatch({
      type: ACTIONS.SET_IS_CHAT_BUBBLE_OPEN,
      value: true,
    });
    handleClickToggleChat()
  }

  const localizedChatName = isPublicChat(chat)
    ? intl.formatMessage(intlMessages.titlePublic)
    : chat.name;

  const arialabel = `${localizedChatName} ${
    stateUreadCount > 1
      ? intl.formatMessage(intlMessages.unreadPlural, { unreadCount: stateUreadCount })
      : intl.formatMessage(intlMessages.unreadSingular)}`;

  return (
    <Styled.ChatListItem
      data-test="chatButton"
      role="button"
      aria-expanded={isCurrentChat}
      active={isCurrentChat}
      tabIndex={tabIndex}
      accessKey={isPublicChat(chat) ? TOGGLE_CHAT_PUB_AK : null}
      onClick={handleClickToggleChat}
      id="chat-toggle-button"
      aria-label={isPublicChat(chat) ? intl.formatMessage(intlMessages.titlePublic) : chat.name}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <Styled.ChatListItemLink>
        <Styled.ChatIcon>
          {chat.icon
            ? (
              <Styled.ChatThumbnail>
                <Icon iconName={chat.icon} />
              </Styled.ChatThumbnail>
            ) : (
              <UserAvatar
                moderator={chat.isModerator}
                avatar={chat.avatar}
                color={chat.color}
              >
                {chat.name.toLowerCase().slice(0, 2)}
              </UserAvatar>
            )}
        </Styled.ChatIcon>
        <Styled.ChatName>
          {!compact
            ? (
              <Styled.ChatNameMain>
                {isPublicChat(chat)
                  ? intl.formatMessage(intlMessages.titlePublic) : chat.name}
              </Styled.ChatNameMain>
            ) : null}
        </Styled.ChatName>
          <Styled.OpenChatButton onClick={openChatModal}>
          <OpenInNewTabIcon />
        </Styled.OpenChatButton>
        {(stateUreadCount > 0)
          ? (
            <Styled.UnreadMessages aria-label={arialabel}>
              <Styled.UnreadMessagesText aria-hidden="true">
                {stateUreadCount}
              </Styled.UnreadMessagesText>
            </Styled.UnreadMessages>
          )
          : null}
      </Styled.ChatListItemLink>
    </Styled.ChatListItem>
  );
};

ChatListItem.propTypes = propTypes;

export default withShortcutHelper(injectIntl(ChatListItem), 'togglePublicChat');
