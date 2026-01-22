import styled from 'styled-components';
import { smallOnly } from '/imports/ui/stylesheets/styled-components/breakpoints';
import Button from '/imports/ui/components/common/button/component';

const HideDropdownButton = styled(Button)`
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

  ${({ open }) => open && `
      @media ${smallOnly} {
        display:none;
      }
   `}
`;

export default {
  HideDropdownButton,
};
