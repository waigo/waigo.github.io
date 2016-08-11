import React from 'react';
import { Link } from 'react-router';
import { prefixLink } from 'gatsby-helpers';
import DocumentTitle from 'react-document-title';
import Header from 'components/header';
import Footer from 'components/footer';
import { config } from 'config';

import waigoPackageJson from '../waigo/package.json';



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
              <p className="tagline">Node.js MVC framework for extendable, scalable apps.</p>
              <p className="description">An ES6-based framework for building APIs and reactive web apps. Uses Koa and RethinkDB.</p>
              <div className="actions">
                <Link to="/docs/GettingStarted/">Get started</Link>
                <Link to="/docs/">Read full docs</Link>
              </div>
              <div className="install">
                npm i -g waigo
              </div>
              <div className="meta">
                <Link to="https://github.com/waigo/waigo/blob/master/CHANGELOG.md" title="View release notes for current version">
                  <i className="version" /><span>{waigoPackageJson.version}</span>
                </Link>
                <Link to="https://twitter.com/waigojs" title="Follow us on twitter">
                  <i className="twitter" /><span>Follow on Twitter</span>
                </Link>
                <Link to="https://github.com/waigo/waigo" title="Star us on Github">
                  <i className="github" /><span>Star on Github</span>
                </Link>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </DocumentTitle>
    )
  }


  componentDidMount () {
    if (window.twttr) {
      twttr.widgets.load();  
    }
  }
}
