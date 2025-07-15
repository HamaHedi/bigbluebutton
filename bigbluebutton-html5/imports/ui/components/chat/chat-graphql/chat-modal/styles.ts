import styled, { css } from 'styled-components'
import { colorGray, colorWhite, colorPrimary, colorText } from '/imports/ui/stylesheets/styled-components/palette'

interface ChatModalProps {
  isDragging?: boolean;
  isResizing?: boolean;
}

interface ResizeHandleProps {
  position: string;
}

interface WindowButtonProps {
  color: string;
}

const ChatModal = styled.div<ChatModalProps>`
  position: fixed;
  min-width: 300px;
  min-height: 400px;
  background: ${colorWhite};
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  user-select: none;
  
  ${({ isDragging }: ChatModalProps) =>
    isDragging &&
    css`
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.25);
      transform: rotate(1deg);
    `}
    
  ${({ isResizing }: ChatModalProps) =>
    isResizing &&
    css`
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.25);
    `}
`

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, ${colorPrimary} 0%, #764ba2 100%);
  cursor: grab;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:active {
    cursor: grabbing;
  }
`

const WindowControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const WindowButton = styled.div<WindowButtonProps>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ color }: WindowButtonProps) => color};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    filter: brightness(1.2);
  }
`

const HeaderTitle = styled.h3`
  color: ${colorWhite};
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  text-align: center;
  flex: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  i {
    font-size: 14px;
    color: ${colorWhite};
  }
`

const ChatContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  background: ${colorWhite};
`

const ResizeHandle = styled.div<ResizeHandleProps>`
  position: absolute;
  
  ${({ position }: ResizeHandleProps) => {
    switch (position) {
      case 'top':
        return css`
          top: 0;
          left: 8px;
          right: 8px;
          height: 4px;
          cursor: ns-resize;
        `;
      case 'right':
        return css`
          top: 8px;
          right: 0;
          bottom: 8px;
          width: 4px;
          cursor: ew-resize;
        `;
      case 'bottom':
        return css`
          bottom: 0;
          left: 8px;
          right: 8px;
          height: 4px;
          cursor: ns-resize;
        `;
      case 'left':
        return css`
          top: 8px;
          left: 0;
          bottom: 8px;
          width: 4px;
          cursor: ew-resize;
        `;
      case 'top-right':
        return css`
          top: 0;
          right: 0;
          width: 8px;
          height: 8px;
          cursor: ne-resize;
        `;
      case 'bottom-right':
        return css`
          bottom: 0;
          right: 0;
          width: 8px;
          height: 8px;
          cursor: se-resize;
        `;
      case 'bottom-left':
        return css`
          bottom: 0;
          left: 0;
          width: 8px;
          height: 8px;
          cursor: sw-resize;
        `;
      case 'top-left':
        return css`
          top: 0;
          left: 0;
          width: 8px;
          height: 8px;
          cursor: nw-resize;
        `;
      default:
        return css``;
    }
  }}
  
  &:hover {
    background: rgba(0, 123, 255, 0.3);
  }
`

export default {
    ChatModal,
    ChatHeader,
    WindowControls,
    WindowButton,
    HeaderTitle,
    CloseButton,
    ChatContent,
    ResizeHandle
}