import React from 'react';

import '../stylus/app.styl';


module.exports = React.createClass({
  propTypes () {
    return {
      children: React.PropTypes.any,
    }
  },
  render () {
    return this.props.children;
  },
});


