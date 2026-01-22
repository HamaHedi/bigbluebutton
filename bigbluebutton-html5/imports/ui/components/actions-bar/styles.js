import styled from 'styled-components';
import { smallOnly } from '/imports/ui/stylesheets/styled-components/breakpoints';
import { smPaddingX, smPaddingY, barsPadding } from '/imports/ui/stylesheets/styled-components/general';
import { colorWhite, colorDanger, colorDangerDark } from '/imports/ui/stylesheets/styled-components/palette';
import Button from '/imports/ui/components/common/button/component';

const ActionsBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
  gap: 0.25rem;
`;

const ActionsBarWrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${barsPadding};
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
  gap: 0.25rem;
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
  gap: 0.25rem;
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
  height: 1.5rem;
  width: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  align-self: center;
  margin: 0 0.25rem;
`;

const Gap = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
`;

const LeaveButton = styled(Button)`
  && {
    background-color: ${colorDanger};
    border: none;
    border-radius: 8px;
    
    &:hover {
      background-color: ${colorDangerDark};
    }

    & > span {
      background-color: ${colorDanger};
      border: none;
      
      &:hover {
        background-color: ${colorDangerDark};
      }
    }

    i {
      color: ${colorWhite};
    }
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
