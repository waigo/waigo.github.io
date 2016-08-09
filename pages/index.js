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
            <div className="splash">
              <div className="large logo" />
              <h1>Waigo.js</h1>
              <p className="tagline">Node.js MVC framework for building scalable apps.</p>
              <p className="description">An ES6-based framework for building reactive APIs and apps. Uses Koa and RethinkDB.</p>
            </div>
          </main>
          <Footer />
        </div>
      </DocumentTitle>
    )
  }
}
