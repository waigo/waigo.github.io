import React from 'react';

import '../stylus/app.styl';


module.exports = React.createClass({
  propTypes () {
    return {
      children: React.PropTypes.any,
    }
  },
  render () {
    return (
      <div className="layout">
        {this.props.children}
      </div>
    );
  },
});


