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
              <p className="description">An ES6-based framework for building reactive APIs and web apps. Uses Koa and RethinkDB.</p>
              <div className="actions">
                <Link to="/get_started/">Get started</Link>
                <Link to="/docs/">Read full docs</Link>
              </div>
              <div className="meta">
                <span>v2.1 "Harambe"</span>
              </div>
              <div className="social">
                <Link to="https://twitter.com/waigojs">
                  <i className="twitter" /><span>Follow us on Twitter</span>
                </Link>
                <Link to="https://github.com/waigo/waigo">
                  <i className="github" /><span>Star us on Github</span>
                </Link>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </DocumentTitle>
    )
  }
}
