import React, { useState, useRef, useEffect, useCallback } from 'react'
import Styled from './styles'
import ChatMessageListContainer from '../chat-message-list/component'
import ChatMessageFormContainer from '../chat-message-form/component'
import { Icon } from '../chat-message-list/page/chat-message/message-content/notification-content/styles'
import { layoutDispatch, layoutSelect } from '../../../layout/context'
import { ACTIONS } from '../../../layout/enums'
import { Layout } from '../../../layout/layoutTypes'

const ChatModal = () => {
    const isChatBubbleOpen = layoutSelect((i : Layout) => i.isChatBubbleOpen);
    const fullscreen = layoutSelect((i : Layout) => i.fullscreen);
    const { element } = fullscreen;
    const isScreenshareFullScreen = (element === 'Screenshare');
    
    const layoutContextDispatch = layoutDispatch();
    const closeChatModal = () => {
        layoutContextDispatch({
            type: ACTIONS.SET_IS_CHAT_BUBBLE_OPEN,
            value: false,
        })
    }

    const [isDragging, setIsDragging] = useState(false)
    const [position, setPosition] = useState({ x: 20, y: 20 })
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    
    const [isResizing, setIsResizing] = useState(false)
    const [resizeHandle, setResizeHandle] = useState('')
    const [size, setSize] = useState({ width: 350, height: 500 })
    
    const modalRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) {
            const newX = e.clientX - dragOffset.x
            const newY = e.clientY - dragOffset.y
            
            const maxX = window.innerWidth - size.width
            const maxY = window.innerHeight - size.height
            
            setPosition({
                x: Math.max(0, Math.min(newX, maxX)),
                y: Math.max(0, Math.min(newY, maxY))
            })
        }
        
        if (isResizing) {
            const rect = modalRef.current?.getBoundingClientRect()
            if (!rect) return
            
            let newWidth = size.width
            let newHeight = size.height
            let newX = position.x
            let newY = position.y
            
            // Calculate the current edges
            const currentRight = position.x + size.width
            const currentBottom = position.y + size.height
            
            // Handle different resize directions
            if (resizeHandle.includes('right')) {
                newWidth = Math.max(300, e.clientX - position.x)
            }
            if (resizeHandle.includes('left')) {
                const maxLeft = currentRight - 300 // Minimum width constraint
                newX = Math.max(0, Math.min(e.clientX, maxLeft))
                newWidth = currentRight - newX
            }
            if (resizeHandle.includes('bottom')) {
                newHeight = Math.max(400, e.clientY - position.y)
            }
            if (resizeHandle.includes('top')) {
                const maxTop = currentBottom - 400 // Minimum height constraint
                newY = Math.max(0, Math.min(e.clientY, maxTop))
                newHeight = currentBottom - newY
            }
            
            // Ensure the modal stays within screen bounds
            const maxX = window.innerWidth - newWidth
            const maxY = window.innerHeight - newHeight
            
            newX = Math.max(0, Math.min(newX, maxX))
            newY = Math.max(0, Math.min(newY, maxY))
            
            setSize({ width: newWidth, height: newHeight })
            setPosition({ x: newX, y: newY })
        }
    }, [isDragging, isResizing, dragOffset, size, position, resizeHandle])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
        setIsResizing(false)
        setResizeHandle('')
    }, [])

    useEffect(() => {
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

    const handleDragStart = (e: React.MouseEvent) => {
        if (!modalRef.current) return
        
        const rect = modalRef.current.getBoundingClientRect()
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
        setIsDragging(true)
    }

    const handleResizeStart = (e: React.MouseEvent, handle: string) => {
        e.stopPropagation()
        setResizeHandle(handle)
        setIsResizing(true)
    }

    if (!isChatBubbleOpen || !isScreenshareFullScreen) return null;

  return (
    <Styled.ChatModal
        ref={modalRef}
        style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${size.width}px`,
            height: `${size.height}px`,
        }}
        isDragging={isDragging}
        isResizing={isResizing}
    >
        <Styled.ChatHeader onMouseDown={handleDragStart}>
            <Styled.HeaderTitle>Chat</Styled.HeaderTitle>
            <Styled.CloseButton onClick={closeChatModal}>
                <Icon iconName="close" />
            </Styled.CloseButton>
        </Styled.ChatHeader>
        
        <Styled.ChatContent>
            <ChatMessageListContainer />
            <ChatMessageFormContainer />
        </Styled.ChatContent>
        
        <Styled.ResizeHandle 
            position="top" 
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeStart(e, 'top')} 
        />
        <Styled.ResizeHandle 
            position="right" 
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeStart(e, 'right')} 
        />
        <Styled.ResizeHandle 
            position="bottom" 
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeStart(e, 'bottom')} 
        />
        <Styled.ResizeHandle 
            position="left" 
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeStart(e, 'left')} 
        />
        <Styled.ResizeHandle 
            position="top-right" 
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeStart(e, 'top-right')} 
        />
        <Styled.ResizeHandle 
            position="bottom-right" 
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeStart(e, 'bottom-right')} 
        />
        <Styled.ResizeHandle 
            position="bottom-left" 
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeStart(e, 'bottom-left')} 
        />
        <Styled.ResizeHandle 
            position="top-left" 
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleResizeStart(e, 'top-left')} 
        />
    </Styled.ChatModal>
  )
}

export default ChatModal