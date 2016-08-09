import React from 'react';
import { Link } from 'react-router';
import { prefixLink } from 'gatsby-helpers';
import DocumentTitle from 'react-document-title';
import Header from 'components/header';
import Footer from 'components/footer';
import { config } from 'config';



export default class Index extends React.Component {
  render () {
    return (
      <DocumentTitle title={config.siteTitle}>
        <div className="page home">
          <Header activeNav="home" />
          <main>
            <h1>{config.siteTitle}</h1>
            <p className="tagline quoted">{config.tagLine}</p>
          </main>
          <Footer />
        </div>
      </DocumentTitle>
    )
  }
}
