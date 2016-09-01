import React from 'react';
import { Link } from 'react-router';
import { prefixLink } from 'gatsby-helpers';
import DocumentTitle from 'react-document-title';
import Header from '../components/header';
import Footer from '../components/footer';
import { config } from 'config';



export default class Index extends React.Component {
  render () {
    return (
      <DocumentTitle title={config.siteTitle}>
        <div className="page home">
          <Header activeNav="home" />
          <main>
            <section className="splash">
              <div className="logo" />
              <p className="tagline">{config.tagLine}</p>
              <div className="actions">
                <Link to={prefixLink(config.gettingStartedLink)}>Get started</Link>
              </div>
              <div className="install">
                npm i -g waigo
              </div>
              <div className="meta">
                <a className="changelog" href="https://github.com/waigo/waigo/blob/master/CHANGELOG.md" title="View release notes for current version">
                  <i className="changelog" /><span>Changelog</span>
                </a>
                <a className="twitter" href={config.twitterUrl} title="Follow us on twitter">
                  <i className="twitter" /><span>Twitter</span>
                </a>
                <a className="github" href={config.githubUrl} title="View on Github">
                  <i className="github" /><span>Github</span>
                </a>
                <a className="discuss" href={config.discussUrl} title="Discuss on Discord">
                  <i className="discuss" /><span>Discuss</span>
                </a>
              </div>
            </section>
            <section className="features-1">
              <p className="intro">Build data-driven APIs, apps and reactive websites.<br />Uses Koa and RethinkDB.</p>
              <ul className="features">
                <li>
                  <div className="title">Koa and RethinkDB</div>
                  <div className="description">
                    Waigo builds on Koa, the ES6-based spiritual successor to Express.
                    Elegantly compose complex middleware patterns.
                    Use RethinkDB to build fully <strong>end-to-end
                    reactive applications</strong>.
                  </div>
                </li>
                <li>
                  <div className="title">Plugin architecture</div>
                  <div className="description">
                    Extend or override any part of the core framework as you
                    see fit. Only use what you need. Publish your
                    customizations as plugins (NPM modules) to re-use across
                    your other Waigo projects.
                  </div>
                </li>
                <li>
                  <div className="title">Form handling</div>
                  <div className="description">
                    Declaratively build
                    forms with automatic sanitization and validation. Initialize
                    and submit forms from any part of your application. Output a
                    form's configuration as JSON. CSRF-prevention comes built-in.
                  </div>
                </li>
                <li>
                  <div className="title">Routing and APIs</div>
                  <div className="description">
                    Powerful route configuration with intelligent nesting and
                    per-route and per-HTTP-method middleware customization.
                    All routes double-up as JSON API endpoints.
                    Control the output format of any route using query
                    parameters. Easily add your own custom output formats.
                  </div>
                </li>
                <li>
                  <div className="title">Frontend is yours</div>
                  <div className="description">
                    Effortlessly build basic HTML
                    using <a href="https://github.com/pugjs/pug">Pug</a> templating
                    and the built-in template helpers. <strong>Use
                    whatever Javascript frameworks
                    (e.g. Angular/React) and CSS languages you want</strong> the rest of the way.
                  </div>
                </li>
                <li>
                  <div className="title">Users and Roles</div>
                  <div className="description">
                    Built-in user accounts. Authenticate
                    users via password, OAuth or custom mechanisms.
                    Assign roles to users, and elegantly control who gets
                    access to what via the Access Control
                    List (ACL).
                  </div>
                </li>
                <li>
                  <div className="title">Email notifications</div>
                  <div className="description">
                    Built-in configurable notifications via email and Slack.
                    Target notifications to specific users or roles and trigger
                    them asynchronously. Send emails to console,
                    using SMTP or a provider (e.g. Mailgun).
                  </div>
                </li>
                <li>
                  <div className="title">Scheduled Tasks</div>
                  <div className="description">
                    Built-in Cron system for task scheduling.
                    Tasks run within the full application context, giving you
                    access to all your data and other parts of the app.
                    Programmatically start, stop and run tasks.
                  </div>
                </li>
                <li>
                  <div className="title">Quick Setup</div>
                  <div className="description">
                    Create and run a skeleton app in seconds using the command-line client.
                    Generate gulp scripts to enable live-reload in the browser during development.
                    Install the <Link to="https://github.com/waigo/admin">Admin interface</Link> for
                    easy data management.
                  </div>
                </li>
              </ul>
            </section>
            <section className="quick-start">
              <div className="wrapper">
                <h2>Quick start</h2>
                <pre>{`$ npm init
$ waigo init
$ waigo init-gulp
$ gulp`}
                </pre>
                <div>
                  <p>Visit <Link to="http://localhost:3000 ">http://localhost:3000</Link> in your browser to see it. </p>
                  <p>Now start editing files and the browser page will auto-reload!</p>
                </div>
              </div>
            </section>
            <section className="next-links">
              <div>
                <Link to={prefixLink(config.docsLink)}>Read the docs &raquo;</Link>
                <p>Get an in-depth introduction to Waigo and how to use it.</p>
              </div>
              <div>
                <a href={config.githubUrl}>View the code &raquo;</a>
                <p>Check out upcoming features and contribute.</p>
              </div>
              <div>
                <a href={config.discussUrl}>Discuss and share &raquo;</a>
                <p>Provide feedback, ask questions and share with the community.</p>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </DocumentTitle>
    )
  }


  componentDidMount () {
    if (window.twttr) {
      window.twttr.widgets.load();
    }
  }
}
