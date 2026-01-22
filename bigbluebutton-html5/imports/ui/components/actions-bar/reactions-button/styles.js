import styled from 'styled-components';
import Button from '/imports/ui/components/common/button/component';

import {
  colorWhite,
  colorGrayDark,
  colorGrayLightest,
  btnPrimaryColor,
  btnPrimaryActiveBg,
  btnPrimaryBg,
} from '/imports/ui/stylesheets/styled-components/palette';

const ReactionsButton = styled(Button)`
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
  `}
`;

const ReactionsDropdown = styled.div`
  position: relative;
`;

const ButtonWrapper = styled.div`
  border: 1px solid transparent;
  cursor: pointer;
  height: 2.5rem;
  display: flex;
  align-items: center;
  border-radius: 50%;
  margin: 0 .5rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    background-color: ${colorGrayDark};
  }

  & > button {
    cursor: pointer;
    flex: auto;
  }

  & > * > span {
    padding: 4px;
    color: ${colorGrayDark} !important;
    border-color: transparent !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  & i {
    width: 1.3rem;
    transition: transform 0.2s ease;
  }

  &:hover i {
    transform: scale(1.05);
  }

  ${({ active }) => active && `
    color: ${btnPrimaryColor};
    background-color: ${btnPrimaryActiveBg};
    box-shadow: 0 0 0 2px rgba(15, 112, 215, 0.2);

    &:hover{
      filter: brightness(90%);
      color: ${btnPrimaryColor};
      background-color: ${btnPrimaryActiveBg} !important;
    }
  `}
`;

const ReactionsButtonWrapper = styled(ButtonWrapper)`
  width: 2.5rem;
  border-radius: 1.7rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  ${({ isMobile }) => !isMobile && `
    border: 1px solid ${colorGrayLightest};
    padding: 1rem 0.5rem;
    width: auto;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(4px);
    
    &:hover {
      border-color: rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.06);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `}

  ${({ active }) => active && `
    color: ${btnPrimaryColor};
    background-color: ${btnPrimaryActiveBg};
    border-color: ${btnPrimaryBg};
    box-shadow: 0 0 0 2px rgba(15, 112, 215, 0.25),
                0 4px 12px rgba(15, 112, 215, 0.15);

    &:hover{
      filter: brightness(90%);
      color: ${btnPrimaryColor};
      background-color: ${btnPrimaryActiveBg} !important;
    }  
  `}
`;

const ToggleButtonWrapper = styled(ButtonWrapper)`
  width: auto;
  padding: 1rem 0.5rem;
  cursor: inherit;
  & > div {
    margin-right: 0.5rem;
    filter: grayscale(100%);
    transition: filter 0.2s ease, transform 0.2s ease;
  }
  &:hover {
    background-color: transparent !important;
  }
  &:hover > div {
    filter: grayscale(50%);
    transform: scale(1.1);
  }
`;

export default {
  ReactionsButton,
  ReactionsDropdown,
  ButtonWrapper,
  ReactionsButtonWrapper,
  ToggleButtonWrapper,
};
