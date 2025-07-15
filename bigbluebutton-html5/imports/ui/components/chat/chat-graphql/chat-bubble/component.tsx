import React, { useState, useRef, useEffect } from 'react'
import Styled from './styles'
import { Icon } from '../chat-message-list/page/chat-message/message-content/notification-content/styles'
import { layoutDispatch, layoutSelect } from '../../../layout/context'
import { ACTIONS } from '../../../layout/enums'
import { Layout } from '../../../layout/layoutTypes'

const ChatBubble = () => {
  const [isDragging, setIsDragging] = useState(false)
  const layoutContextDispatch = layoutDispatch();
  const isChatBubbleOpen = layoutSelect((i : Layout) => i.isChatBubbleOpen);

  //bottom right initial position
  const [position, setPosition] = useState({ x: window.innerWidth - 30, y: window.innerHeight - 30 }) // Bottom left initial position
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
      onClick={() => 
        layoutContextDispatch({
          type: ACTIONS.SET_IS_CHAT_BUBBLE_OPEN,
          value: !isChatBubbleOpen,
        })
      }
    >
      <Styled.Icon>
        <Icon iconName="chat" />
      </Styled.Icon>
    </Styled.Bubble>
  )
}

export default ChatBubble