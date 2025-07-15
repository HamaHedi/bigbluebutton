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

    const layoutContextDispatch = layoutDispatch();
    const closeChatModal = () => {
        layoutContextDispatch({
            type: ACTIONS.SET_IS_CHAT_BUBBLE_OPEN,
            value: false,
        })
    }

    // Drag functionality
    const [isDragging, setIsDragging] = useState(false)
    const [position, setPosition] = useState({ x: 20, y: 20 })
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    
    // Resize functionality
    const [isResizing, setIsResizing] = useState(false)
    const [resizeHandle, setResizeHandle] = useState('')
    const [size, setSize] = useState({ width: 350, height: 500 })
    
    const modalRef = useRef<HTMLDivElement>(null)

    // Mouse move handler for drag and resize
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) {
            const newX = e.clientX - dragOffset.x
            const newY = e.clientY - dragOffset.y
            
            // Constrain to window boundaries
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
            
            // Handle different resize directions
            if (resizeHandle.includes('right')) {
                newWidth = Math.max(300, e.clientX - rect.left)
            }
            if (resizeHandle.includes('left')) {
                newWidth = Math.max(300, rect.right - e.clientX)
                newX = Math.min(position.x, e.clientX)
            }
            if (resizeHandle.includes('bottom')) {
                newHeight = Math.max(400, e.clientY - rect.top)
            }
            if (resizeHandle.includes('top')) {
                newHeight = Math.max(400, rect.bottom - e.clientY)
                newY = Math.min(position.y, e.clientY)
            }
            
            setSize({ width: newWidth, height: newHeight })
            setPosition({ x: newX, y: newY })
        }
    }, [isDragging, isResizing, dragOffset, size, position, resizeHandle])

    // Mouse up handler
    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
        setIsResizing(false)
        setResizeHandle('')
    }, [])

    // Add/remove event listeners
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

    // Drag start handler
    const handleDragStart = (e: React.MouseEvent) => {
        if (!modalRef.current) return
        
        const rect = modalRef.current.getBoundingClientRect()
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
        setIsDragging(true)
    }

    // Resize start handler
    const handleResizeStart = (e: React.MouseEvent, handle: string) => {
        e.stopPropagation()
        setResizeHandle(handle)
        setIsResizing(true)
    }

    if (!isChatBubbleOpen) return null;

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
            <Styled.WindowControls>
                <Styled.WindowButton color="#ff5f56" onClick={closeChatModal} />
                <Styled.WindowButton color="#ffbd2e" />
                <Styled.WindowButton color="#27ca3f" />
            </Styled.WindowControls>
            <Styled.HeaderTitle>Chat</Styled.HeaderTitle>
            <Styled.CloseButton onClick={closeChatModal}>
                <Icon iconName="close" />
            </Styled.CloseButton>
        </Styled.ChatHeader>
        
        <Styled.ChatContent>
            <ChatMessageListContainer />
            <ChatMessageFormContainer />
        </Styled.ChatContent>
        
        {/* Resize handles */}
        <Styled.ResizeHandle 
            position="top" 
            onMouseDown={(e) => handleResizeStart(e, 'top')} 
        />
        <Styled.ResizeHandle 
            position="right" 
            onMouseDown={(e) => handleResizeStart(e, 'right')} 
        />
        <Styled.ResizeHandle 
            position="bottom" 
            onMouseDown={(e) => handleResizeStart(e, 'bottom')} 
        />
        <Styled.ResizeHandle 
            position="left" 
            onMouseDown={(e) => handleResizeStart(e, 'left')} 
        />
        <Styled.ResizeHandle 
            position="top-right" 
            onMouseDown={(e) => handleResizeStart(e, 'top-right')} 
        />
        <Styled.ResizeHandle 
            position="bottom-right" 
            onMouseDown={(e) => handleResizeStart(e, 'bottom-right')} 
        />
        <Styled.ResizeHandle 
            position="bottom-left" 
            onMouseDown={(e) => handleResizeStart(e, 'bottom-left')} 
        />
        <Styled.ResizeHandle 
            position="top-left" 
            onMouseDown={(e) => handleResizeStart(e, 'top-left')} 
        />
    </Styled.ChatModal>
  )
}

export default ChatModal