import styled, { css, keyframes } from 'styled-components';
import { smallOnly } from '/imports/ui/stylesheets/styled-components/breakpoints';
import { smPaddingX, smPaddingY, barsPadding } from '/imports/ui/stylesheets/styled-components/general';
import { colorWhite, colorBackground, colorPrimary, btnPrimaryBg } from '/imports/ui/stylesheets/styled-components/palette';
import Button from '/imports/ui/components/common/button/component';

// Subtle pulse animation for active states
const subtlePulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(15, 112, 215, 0);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(15, 112, 215, 0.15);
  }
`;

// Shared button enhancement styles
const buttonEnhancement = css`
  /* Smooth transitions for all interactive states */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  & > span {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 
                0 1px 3px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
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
`;

const ActionsBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  
  /* Apply button enhancements to all direct button children */
  button {
    ${buttonEnhancement}
  }
`;

const ActionsBarWrapper = styled.section`
  flex: 1;
  padding: ${barsPadding};
  background: linear-gradient(
    180deg, 
    rgba(6, 23, 42, 0.95) 0%, 
    ${colorBackground} 100%
  );
  position: relative;
  order: 3;
  
  /* Subtle top highlight */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.08) 50%, 
      transparent 100%
    );
  }
`;

const Left = styled.div`
  display: inherit;
  flex: 0;
  > *:not(span) {
    @media ${smallOnly} {
      margin: 0 ${smPaddingY};
    }
  }
  @media ${smallOnly} {
    bottom: ${smPaddingX};
    left: ${smPaddingX};
    right: auto;
    [dir="rtl"] & {
      left: auto;
      right: ${smPaddingX};
    }
  }
`;

const Center = styled.div`
  display: flex;
  flex-direction: row;
  gap: calc(${smPaddingX} + 2px);
  flex: 1;
  justify-content: center;
  align-items: center;
  
  > *:not(span):not(:last-child) {
    @media ${smallOnly} {
      margin: 0 ${smPaddingY};
    }
  }
  
  /* Staggered entrance feel on hover for button groups */
  &:hover > button,
  &:hover > div > button {
    & > span {
      border-color: rgba(255, 255, 255, 0.1);
    }
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
  [dir="rtl"] & {
    right: auto;
    left: ${smPaddingX};
  }
  @media ${smallOnly} {
    right: 0;
    left: 0;
    display: contents;
  }
  > *:not(span) {
    @media ${smallOnly} {
      margin: 0 ${smPaddingY};
    }
  }
`;

const RaiseHandButton = styled(Button)`
  ${buttonEnhancement}
  
  ${({ ghost }) => ghost && `
    & > span {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15),
                  inset 0 0 0 1.5px ${colorWhite};
      background-color: rgba(255, 255, 255, 0.05) !important;
      border-color: transparent !important;
    }
    
    &:hover > span {
      background-color: rgba(255, 255, 255, 0.1) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2),
                  inset 0 0 0 1.5px ${colorWhite};
    }
  `}
  
  /* Raised hand active state - subtle pulse */
  ${({ ghost }) => !ghost && `
    & > span {
      animation: ${subtlePulse} 2s ease-in-out infinite;
    }
  `}
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  > * {
    margin: 8px;
  }
`;

const ReactionsDropdown = styled.div`
  position: relative;
`;

const Wrapper = styled.div`
  overflow: hidden;
  margin: 0.2em 0.2em 0.2em 0.2em;
  text-align: center;
  max-height: 270px;
  width: 270px;
  em-emoji {
    cursor: pointer;
    transition: transform 0.15s ease;
    
    &:hover {
      transform: scale(1.15);
    }
  }
`;

const Separator = styled.div`
  height: 2rem;
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 20%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0.4) 80%,
    transparent 100%
  );
  align-self: center;
  margin: 0 0.25rem;
  border: none;
`;

const Gap = styled.div`
  display: flex;
  gap: .5rem;
  align-items: center;
`;

export default {
  ActionsBar,
  Left,
  Center,
  Right,
  RaiseHandButton,
  ButtonContainer,
  ReactionsDropdown,
  Wrapper,
  ActionsBarWrapper,
  Gap,
  Separator,
};
