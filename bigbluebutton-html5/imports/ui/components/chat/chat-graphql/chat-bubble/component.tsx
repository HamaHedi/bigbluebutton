import React, { useState, useRef, useEffect } from 'react'
import Styled from './styles'
import { Icon } from '../chat-message-list/page/chat-message/message-content/notification-content/styles'
import { layoutDispatch, layoutSelect } from '../../../layout/context'
import { ACTIONS } from '../../../layout/enums'
import { Layout } from '../../../layout/layoutTypes'
import useChat from '/imports/ui/core/hooks/useChat'
import Chat from '../../../user-list/user-list-content/user-messages/chat-list/chat-list-item/chatTypes'
import { GraphqlDataHookSubscriptionResponse } from '/imports/ui/Types/hook'

const ChatBubble = () => {
  const fullscreen = layoutSelect((i : Layout) => i.fullscreen);
  const { element } = fullscreen;
  const isScreenshareFullScreen = (element === 'Screenshare');
  
  const CHAT_CONFIG = window.meetingClientSettings.public.chat;
  const PUBLIC_GROUP_CHAT_ID = CHAT_CONFIG.public_group_id;

  const isPublicGroupChat = (chat: Chat) => chat.chatId === PUBLIC_GROUP_CHAT_ID;
  const { data: chats } = useChat((chat) => chat) as GraphqlDataHookSubscriptionResponse<Chat[]>;
  const publicGroupChat = chats?.find(isPublicGroupChat);
  const totalUnreadMessages = publicGroupChat?.totalUnread || 0;

  const [isDragging, setIsDragging] = useState(false)
  const layoutContextDispatch = layoutDispatch();
  const isChatBubbleOpen = layoutSelect((i : Layout) => i.isChatBubbleOpen);

  const [position, setPosition] = useState({ x: 15, y: 15 }) // top left initial position
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const bubbleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y
      
      // Constrain to window boundaries
      const maxX = window.innerWidth - 60
      const maxY = window.innerHeight - 60
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!bubbleRef.current) return
    
    const rect = bubbleRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setIsDragging(true)
  }

  if(!isScreenshareFullScreen)
    return null;

  return (
    <Styled.Bubble
      ref={bubbleRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      isDragging={isDragging}
      onClick={() => {
        layoutContextDispatch({
          type: ACTIONS.SET_IS_CHAT_BUBBLE_OPEN,
          value: !isChatBubbleOpen,
        })
        layoutContextDispatch({
          type: ACTIONS.SET_ID_CHAT_OPEN,
          value: PUBLIC_GROUP_CHAT_ID,
        })}
      }
    >
     {totalUnreadMessages > 0 && <Styled.UnreadBadge>{totalUnreadMessages}</Styled.UnreadBadge>}
      <Styled.Icon>
        <Icon iconName="chat" />
      </Styled.Icon>
    </Styled.Bubble>
  )
}

export default ChatBubble