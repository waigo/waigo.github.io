import React from 'react';
import ApiTemplate from '../components/apiTemplate';


export default class Layout extends React.Component {
  render () {
    return <ApiTemplate page={this.props.route.page} />;
  }
}


Layout.propTypes = {
  route: React.PropTypes.object,
};

