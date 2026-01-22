import styled, { keyframes } from 'styled-components';
import ModalSimple from '/imports/ui/components/common/modal/simple/component';
import { colorGrayDark } from '/imports/ui/stylesheets/styled-components/palette';
import {
  jumboPaddingY,
  minModalHeight,
  mdPaddingX,
} from '/imports/ui/stylesheets/styled-components/general';
import {
  fontSizeLarge,
  headingsFontWeight,
} from '/imports/ui/stylesheets/styled-components/typography';

// Subtle broadcasting pulse for active screenshare
const broadcastPulse = keyframes`
  0%, 100% {
    box-shadow: 0 2px 8px rgba(15, 112, 215, 0.3),
                0 0 0 0 rgba(15, 112, 215, 0);
  }
  50% {
    box-shadow: 0 2px 12px rgba(15, 112, 215, 0.4),
                0 0 0 4px rgba(15, 112, 215, 0.1);
  }
`;

const ScreenShareModal = styled(ModalSimple)`
  padding: ${jumboPaddingY};
  min-height: ${minModalHeight};
  text-align: center;
`;

const Title = styled.h3`
  font-weight: ${headingsFontWeight};
  font-size: ${fontSizeLarge};
  color: ${colorGrayDark};
  white-space: normal;
  padding-bottom: ${mdPaddingX};
`;

const Container = styled.span`
  display: flex;
  flex-flow: row;
  position: relative;

  & > div {
    position: relative;
  }

  & > :last-child {
    margin-right: 0;
  }
  
  /* Enhanced button styling */
  & button {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    & > span {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 
                  0 1px 3px rgba(0, 0, 0, 0.1),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    
    &:hover > span {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 
                  0 2px 6px rgba(0, 0, 0, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }
    
    &:active > span {
      transform: translateY(0);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15),
                  inset 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    & span i {
      transition: transform 0.2s ease;
    }
    
    &:hover span i {
      transform: scale(1.05);
    }
  }
  
  /* When actively broadcasting - add pulse animation */
  & button[id="unshare-screen-button"] > span {
    animation: ${broadcastPulse} 2.5s ease-in-out infinite;
  }
`;

export default {
  ScreenShareModal,
  Title,
  Container,
};
