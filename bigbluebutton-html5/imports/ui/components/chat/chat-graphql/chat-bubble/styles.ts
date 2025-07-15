import styled, { css } from 'styled-components';
import { colorPrimary } from '/imports/ui/stylesheets/styled-components/palette';

const Bubble = styled.div<{ isDragging?: boolean }>`
  position: fixed;
  width: 50px;
  height: 50px;
  background: ${colorPrimary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  z-index: 1000;
  box-shadow: 0 2px 10px ${colorPrimary};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  ${(props: { isDragging?: boolean }) =>
    props.isDragging &&
    css`
      cursor: grabbing;
      transform: scale(1.05);
      box-shadow: 0 8px 30px rgba(102, 126, 234, 0.8);
      transition: none;
    `}
    
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const Icon = styled.div`
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  position: relative;
  
  i {
    font-size: 20px;
    color: #ffffff;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 8px;
    right: 8px;
    width: 8px;
    height: 8px;
    background: #ff4757;
    border-radius: 50%;
    border: 2px solid #ffffff;
    opacity: 0;
    transform: scale(0);
    transition: all 0.3s ease;
  }
  
  &.has-notification::after {
    opacity: 1;
    transform: scale(1);
  }
`;

const UnreadBadge = styled.div`
  position: absolute;
  bottom: 0px;
  right: 0;
  background: #DF2721;
  color: #ffffff;
  font-size: 0.8rem;
  line-height: calc(1px + 1rem);
  padding: 0px 0.5rem;
  border-radius: 0.5rem / 50%;
  text-align: center;
`;

export default {
  Bubble,
  Icon,
  UnreadBadge
}