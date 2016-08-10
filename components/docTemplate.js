import React from 'react';
import DocumentTitle from 'react-document-title';
import Header from './header';
import Footer from './footer';


export default class Layout extends React.Component {
  render () {
    const page = this.props.page;

    return (
      <DocumentTitle title={page.data.title}>
        <div className="page docs">
          <Header activeNav="docs" />
          <main dangerouslySetInnerHTML={{ __html: page.data.body }} />
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}


Layout.propTypes = {
  page: React.PropTypes.object,
};
