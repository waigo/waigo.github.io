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
            <section className="splash">
              <div className="logo" />
              <p className="tagline">Node.js ES6 framework for extendable, scalable back-ends.</p>
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
            </section>
            <section className="features-1">
              <p className="intro">Build data-driven APIs, apps and reactive websites.<br />Uses Koa and RethinkDB.</p>
              <ul className="features">
                <li>
                  <div className="title">Koa and RethinkDB</div>
                  <div className="description">
                    Waigo builds on Koa, the ES6-based spiritual successor to Express.
                    Elegantly compose complex middleware patterns. 
                    Use the flexible database layer (<a href="https://hiddentao.github.io/thinodium/">Thinodium</a>) 
                    to build fully end-to-end <strong>reactive</strong> applications.
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
                  <div className="title">View templates</div>
                  <div className="description">
                    Effortlessly build pages in using the Pug (formerly Jade) 
                    templating language. Built-in template helpers for 
                    dyhamically generating route URLs. Templating extends to 
                    emails too - no more hard-coding.
                  </div>   
                </li>
                <li>
                  <div className="title">Users and Roles</div>
                  <div className="description">
                    Built-in user accounts. Authenticate 
                    users via password, OAuth and your own mechanism.
                    Assign roles to users, elegantly control who gets 
                    access to what in your app via the Access Control 
                    List (ACL).
                  </div>   
                </li>
                <li>
                  <div className="title">Email notifications</div>
                  <div className="description">
                    Built-in configurable notifications via email and Slack. 
                    Target notifications to specific users and trigger them
                    from any part of your app. Send emails to console, via 
                    localhost or any mailing provider (e.g. Mailgun).
                  </div>   
                </li>
                <li>
                  <div className="title">Scheduled Tasks</div>
                  <div className="description">
                    Built-in Cron system for task scheduling. 
                    Tasks run within the full application context, giving you 
                    access to your data and all other parts of the app. 
                    Programmatically start, stop and run tasks.
                  </div>   
                </li>
                <li>
                  <div className="title">Quick Setup</div>
                  <div className="description">
                    Create and run a skeleton app in seconds using the command-line client.
                    Generate gulp scripts to enable live-reload in the browser during development.
                    Install the <a href="https://github.com/waigo/admin">Admin interface</a> for 
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
$ gulp dev`}
                </pre>
                <div>
                  <p>Visit <strong>http://localhost:3000</strong> in your browser to see it. </p>
                  <p>Now start editing files and the browser page will auto-reload!</p>
                </div>
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
      twttr.widgets.load();  
    }
  }
}
