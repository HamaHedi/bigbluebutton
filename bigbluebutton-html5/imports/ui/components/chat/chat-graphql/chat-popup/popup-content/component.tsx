import React from 'react';
import {
  defineMessages, useIntl,
} from 'react-intl';
import {
  PopupContentBox, PopupContentHeader, PopupContentBody, CloseButton,
} from './styles';

interface PopupContentProps {
  message: string;
  closePopup: () => void;
}

const intlMessages = defineMessages({
  closePopup: {
    id: 'app.chat.closePopup',
    description: 'close popup button label',
  },
});

const PopupContent: React.FC<PopupContentProps> = ({ message, closePopup }) => {
  const intl = useIntl();
  console.log("change made by hazem braiek")	
  const [showPopup, setShowPopup] = React.useState(false);
  if (!showPopup) return null;
  return (
    <PopupContentBox data-test="welcomeMessage">
      <PopupContentHeader>
        <CloseButton
          size="sm"
          label={intl.formatMessage(intlMessages.closePopup)}
          hideLabel
          icon="close"
          onClick={() => {
            setShowPopup(false);
            if (closePopup) closePopup();
          }}
          data-test="closePopup"
        />
      </PopupContentHeader>
      <PopupContentBody dangerouslySetInnerHTML={{ __html: message }} />
    </PopupContentBox>
  );
};

export default PopupContent;
