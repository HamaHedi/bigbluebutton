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
<<<<<<< HEAD
  console.log("change made by hazem braiek")	
=======
>>>>>>> 0a0de1e029711e58039a400ab1db73f83ae72e83
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
