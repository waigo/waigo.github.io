import React from 'react';
import DocumentTitle from 'react-document-title';
import { config } from 'config';
import Header from '../components/header';
import Footer from '../components/footer';



module.exports = React.createClass({
  propTypes () {
    return {
      route: React.PropTypes.object,
    }
  },
  render () {
    console.log(this.props.route.page);

    const post = this.props.route.page.data;

    return (
      <DocumentTitle title={post.title}>
        <div className="page docs">
          <Header activeNav="docs" />
          <main>{post.body}</main>
          <Footer />
        </div>
      </DocumentTitle>
    );
  },
});


