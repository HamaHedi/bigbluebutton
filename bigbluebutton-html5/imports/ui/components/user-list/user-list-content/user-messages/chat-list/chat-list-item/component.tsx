/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jsx-a11y/no-access-key */
import React, { useEffect } from 'react';
import { layoutSelect, layoutSelectInput, layoutDispatch } from '/imports/ui/components/layout/context';
import { ACTIONS, PANELS } from '/imports/ui/components/layout/enums';
import { defineMessages, useIntl } from 'react-intl';
import Styled from './styles';
import Icon from '/imports/ui/components/common/icon/component';
import { Input, Layout } from '/imports/ui/components/layout/layoutTypes';
import { useShortcut } from '../../../../../../core/hooks/useShortcut';
import { Chat } from '/imports/ui/Types/chat';

const OpenInNewTabIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="open-in-new-tab-outline"><g fill="#4e5a66" fill-rule="evenodd" class="Vector" clip-rule="evenodd"><path d="M5 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5.263a1 1 0 1 1 2 0V19a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h5.017a1 1 0 1 1 0 2z"/><path d="M21.411 2.572a.963.963 0 0 1 0 1.36l-8.772 8.786a.96.96 0 0 1-1.358 0a.963.963 0 0 1 0-1.36l8.773-8.786a.96.96 0 0 1 1.357 0"/><path d="M21.04 2c.53 0 .96.43.96.962V8c0 .531-.47 1-1 1s-1-.469-1-1V4h-4c-.53 0-1-.469-1-1s.43-1 .96-1z"/></g></g></svg>
  );
};

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

interface ChatListItemProps {
  chat: Chat;
  chatNodeRef: React.Ref<HTMLButtonElement>;
  index: number;
}

const ChatListItem = (props: ChatListItemProps) => {
  const sidebarContent = layoutSelectInput((i: Input) => i.sidebarContent);
  const idChatOpen = layoutSelect((i: Layout) => i.idChatOpen);
  const layoutContextDispatch = layoutDispatch();
  const isChatBubbleOpen = layoutSelect((i : Layout) => i.isChatBubbleOpen);

  const { sidebarContentPanel } = sidebarContent;
  const sidebarContentIsOpen = sidebarContent.isOpen;

  const TOGGLE_CHAT_PUB_AK: string = useShortcut('togglePublicChat');
  const {
    chat,
    chatNodeRef,
    index,
  } = props;

  const countUnreadMessages = chat.totalUnread || 0;

  const intl = useIntl();

  const chatPanelOpen = sidebarContentIsOpen && sidebarContentPanel === PANELS.CHAT;

  const isCurrentChat = chat.chatId === idChatOpen && chatPanelOpen;

  const ROLE_MODERATOR = window.meetingClientSettings.public.user.role_moderator;

  const CHAT_CONFIG = window.meetingClientSettings.public.chat;
  const PUBLIC_GROUP_CHAT_ID = CHAT_CONFIG.public_group_id;

  const isPublicGroupChat = (chat: Chat) => chat.chatId === PUBLIC_GROUP_CHAT_ID;

  useEffect(() => {
    if (chat.chatId !== PUBLIC_GROUP_CHAT_ID && chat.chatId === idChatOpen) {
      layoutContextDispatch({
        type: ACTIONS.SET_ID_CHAT_OPEN,
        value: chat.chatId,
      });
    }
  }, [idChatOpen, sidebarContentIsOpen, sidebarContentPanel, chat]);

  const closeChat = ()=> {
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
  }

  const handleClickToggleChat = () => {
    // Verify if chat panel is open

    if (sidebarContentIsOpen && sidebarContentPanel === PANELS.CHAT) {
      if (idChatOpen === chat.chatId) {
        closeChat()
      } else {
        setTimeout(() => {
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
        }, 0);
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

  const openChatModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    layoutContextDispatch({
      type: ACTIONS.SET_IS_CHAT_BUBBLE_OPEN,
      value: !isChatBubbleOpen,
    });
    closeChat()
  }

  const localizedChatName = isPublicGroupChat(chat)
    ? intl.formatMessage(intlMessages.titlePublic)
    : chat.participant?.name;

  const arialabel = `${localizedChatName} ${countUnreadMessages > 1
    ? intl.formatMessage(intlMessages.unreadPlural, { unreadCount: countUnreadMessages })
    : intl.formatMessage(intlMessages.unreadSingular)}`;

  return (
    <Styled.ChatListItem
      data-test="chatButton"
      role="button"
      aria-expanded={isCurrentChat}
      active={isCurrentChat}
      tabIndex={-1}
      accessKey={isPublicGroupChat(chat) ? TOGGLE_CHAT_PUB_AK : undefined}
      onClick={handleClickToggleChat}
      id={`chat-list-${index}`}
      aria-label={isPublicGroupChat(chat) ? intl.formatMessage(intlMessages.titlePublic)
        : chat.participant?.name}
      ref={chatNodeRef}
    >
      <Styled.ChatListItemLink>
        <Styled.ChatIcon>
          {isPublicGroupChat(chat)
            ? (
              <Styled.ChatThumbnail>
                <Icon iconName="group_chat" className={undefined} prependIconName={undefined} rotate={undefined} color={undefined} />
              </Styled.ChatThumbnail>
            ) : (
              <Styled.UserAvatar
                moderator={chat.participant?.role === ROLE_MODERATOR}
                avatar={chat.participant?.avatar || ''}
                color={chat.participant?.color || ''}
              >
                {chat.participant?.avatar?.length === 0 ? chat.participant?.name?.toLowerCase().slice(0, 2) : ''}
              </Styled.UserAvatar>
            )}
        </Styled.ChatIcon>
        <Styled.ChatName>
          <Styled.ChatNameMain active={false}>
            {isPublicGroupChat(chat)
              ? intl.formatMessage(intlMessages.titlePublic) : chat.participant?.name}
          </Styled.ChatNameMain>
        </Styled.ChatName>
        <Styled.OpenChatButton onClick={openChatModal}>
          <OpenInNewTabIcon />
        </Styled.OpenChatButton>
        {(countUnreadMessages > 0)
          ? (
            <Styled.UnreadMessages data-test="unreadMessages" aria-label={arialabel}>
              <Styled.UnreadMessagesText aria-hidden="true">
                {countUnreadMessages}
              </Styled.UnreadMessagesText>
            </Styled.UnreadMessages>
          )
          : null}
      </Styled.ChatListItemLink>
    </Styled.ChatListItem>
  );
};

export default ChatListItem;
