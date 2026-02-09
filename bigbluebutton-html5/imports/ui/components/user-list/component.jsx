import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import injectWbResizeEvent from '/imports/ui/components/presentation/resize-wrapper/component';
import Styled from './styles';
import CustomLogo from './custom-logo/component';
import UserContentContainer from './user-list-content/container';

const propTypes = {
  compact: PropTypes.bool,
  CustomLogoUrl: PropTypes.string,
  CustomDarkLogoUrl: PropTypes.string,
  DarkModeIsEnabled: PropTypes.bool,
  showBranding: PropTypes.bool.isRequired,
};

const defaultProps = {
  compact: false,
  CustomLogoUrl: null,
  CustomDarkLogoUrl: null,
};

class UserList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
    };
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  clearSearch = () => {
    this.setState({ searchQuery: '' });
  };

  render() {
    const {
      compact,
      CustomLogoUrl,
      CustomDarkLogoUrl,
      DarkModeIsEnabled,
      showBranding,
    } = this.props;
    const { searchQuery } = this.state;
    const logoUrl = DarkModeIsEnabled ? CustomDarkLogoUrl : CustomLogoUrl;

    return (
      <Styled.UserList>
        {showBranding && !compact && logoUrl && (
          <CustomLogo CustomLogoUrl={logoUrl} />
        )}
        
      
        <UserContentContainer 
          compact={compact}
          searchQuery={searchQuery}
        />
      </Styled.UserList>
    );
  }
}

UserList.propTypes = propTypes;
UserList.defaultProps = defaultProps;

export default injectWbResizeEvent(UserList);