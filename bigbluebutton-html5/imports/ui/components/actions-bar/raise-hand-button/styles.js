import styled, { keyframes } from 'styled-components';
import { colorWhite, btnPrimaryBg } from '/imports/ui/stylesheets/styled-components/palette';
import Button from '/imports/ui/components/common/button/component';

// Gentle wave animation for raised hand
const gentleWave = keyframes`
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(8deg);
  }
  75% {
    transform: rotate(-8deg);
  }
`;

// Subtle glow pulse for active state
const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 2px 8px rgba(15, 112, 215, 0.3),
                0 0 0 0 rgba(15, 112, 215, 0);
  }
  50% {
    box-shadow: 0 2px 12px rgba(15, 112, 215, 0.4),
                0 0 0 4px rgba(15, 112, 215, 0.1);
  }
`;

const RaiseHandButton = styled(Button)`
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  ${({ ghost }) => ghost && `
    & > span {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15),
                  inset 0 0 0 1.5px ${colorWhite};
      background-color: rgba(255, 255, 255, 0.05) !important;
      border-color: transparent !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    &:hover > span {
      transform: translateY(-1px);
      background-color: rgba(255, 255, 255, 0.1) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2),
                  inset 0 0 0 1.5px ${colorWhite};
    }
    
    &:active > span {
      transform: translateY(0);
    }
  `}
  
  /* When hand is raised (not ghost) - show active state with animation */
  ${({ ghost }) => !ghost && `
    & > span {
      box-shadow: 0 2px 8px rgba(15, 112, 215, 0.3);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      animation: ${glowPulse} 2.5s ease-in-out infinite;
    }
    
    & span i {
      animation: ${gentleWave} 1.5s ease-in-out infinite;
      transform-origin: bottom center;
    }
    
    &:hover > span {
      box-shadow: 0 4px 16px rgba(15, 112, 215, 0.4);
    }
  `}
   
  & span i {
    left: -.05rem;
    transition: transform 0.2s ease;
  }
  
  &:hover span i {
    transform: scale(1.1);
  }
`;

export default {
  RaiseHandButton,
};
