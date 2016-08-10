import React from 'react';
import DocTemplate from '../components/docTemplate';


export default class Layout extends React.Component {
  render () {
    return <DocTemplate page={this.props.route.page} />;
  }
}


Layout.propTypes = {
  route: React.PropTypes.object,
};

