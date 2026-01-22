import styled from 'styled-components';
import { smallOnly } from '/imports/ui/stylesheets/styled-components/breakpoints';
import { smPaddingX, smPaddingY } from '/imports/ui/stylesheets/styled-components/general';
import { colorWhite } from '/imports/ui/stylesheets/styled-components/palette';
import Button from '/imports/ui/components/common/button/component';

const ActionsBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #1c1c1c;
  border-radius: 8px;
  padding: 6px 8px;
  gap: 2px;
`;

const ActionsBarWrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  position: relative;
  order: 3;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
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
  gap: 2px;
  flex: 1;
  justify-content: center;
  align-items: center;
  > *:not(span):not(:last-child) {
    @media ${smallOnly} {
      margin: 0 ${smPaddingY};
    }
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  gap: 2px;
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
  ${({ ghost }) => ghost && `
    & > span {
      box-shadow: none;
      background-color: transparent !important;
      border-color: ${colorWhite} !important;
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
  }
`;

const Separator = styled.div`
  height: 24px;
  width: 1px;
  background-color: rgba(255, 255, 255, 0.15);
  align-self: center;
  margin: 0 4px;
`;

const Gap = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
`;

const LeaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #dc2626;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;

  &:hover {
    background-color: #b91c1c;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.5);
  }

  &:active {
    background-color: #991b1b;
  }

  i {
    color: ${colorWhite};
    font-size: 1.2rem;
  }
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
  LeaveButton,
};
