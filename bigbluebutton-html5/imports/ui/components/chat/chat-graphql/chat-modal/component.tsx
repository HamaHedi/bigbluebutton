import React from 'react'
import Styled from './styles'
import ChatMessageListContainer from '../chat-message-list/component'
import ChatMessageFormContainer from '../chat-message-form/component'
import { Icon } from '../chat-message-list/page/chat-message/message-content/notification-content/styles'
import { layoutDispatch } from '../../../layout/context'
import { ACTIONS } from '../../../layout/enums'

const ChatModal = () => {
    const layoutContextDispatch = layoutDispatch();
    const closeChatModal = () => {
        layoutContextDispatch({
            type: ACTIONS.SET_IS_CHAT_BUBBLE_OPEN,
            value: false,
        })
    }

  return (
    <Styled.ChatModal>
        <Styled.ChatHeader >
            <Icon iconName="close" onClick={closeChatModal} />
        </Styled.ChatHeader>
      <ChatMessageListContainer />
      <ChatMessageFormContainer />
    </Styled.ChatModal>
  )
}

export default ChatModal