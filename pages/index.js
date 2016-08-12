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
              <p className="intro">Build data-driven APIs, apps and reactive websites. Uses Koa and RethinkDB.</p>
              <ul className="features">
                <li>
                  <div className="title">Koa and RethinkDB</div>
                  <div className="descripton">
                    Waigo builds on Koa, the ES6-based spiritual successor to Express, 
                    allowing you to elegantly compose complex middleware patterns. 
                    <a href="https://hiddentao.github.io/thinodium/">Thinodium</a> 
                    provides a powerful and flexible database layer 
                    to RethinkDB, enabling you to build fully <strong>reactive</strong> applications.
                  </div>   
                </li>
                <li>
                  <div className="title">Customization and Plugins</div>
                  <div className="descripton">
                    Waigo recognizes that very app is 
                    different and doesn't try to force you to do things in one 
                    way. Extend or override any part of the core framework as you 
                    see fit.
                    Keep the parts you need, and get rid of the parts you don't. 
                    Publish your customizations as plugins (NPM 
                    modules) to re-use across your other Waigo projects.
                  </div>   
                </li>
                <li>
                  <div className="title">Form handling</div>
                  <div className="descripton">
                    Forms are first-class items in Waigo. Declaratively build 
                    forms with automatic sanitization and validation. Initialize 
                    and submit forms from any part of your application. Output a 
                    form's configuration as 
                    JSON for dynamic front-end UI construction. And lest we 
                    forget, CSRF-prevention comes built-in for all forms.
                  </div>   
                </li>
                <li>
                  <div className="title">Routing and APIs</div>
                  <div className="descripton">
                    Powerful route configuration with intelligent nesting and 
                    per-route and per-HTTP-method middleware customization.
                    All your routes also double-up as JSON API endpoints. 
                    Control the output format of any route using query 
                    parameters and easily add your own custom output formats 
                    for when you need them.
                  </div>   
                </li>
                <li>
                  <div className="title">Views and Templates</div>
                  <div className="descripton">
                    Waigo uses Pug (formerly Jade), a proven 
                    language for view templating. Built-in template helpers for 
                    generating URLs mean no more fragile URL hard-coding inside your 
                    views. Templating extends to emails too - no more 
                    hard-coding strings in your code.
                  </div>   
                </li>
                <li>
                  <div className="title">Users and Access Control</div>
                  <div className="descripton">
                    Built-in user registration and authentication. Authenticate 
                    users via password, OAuth and any other mechanism of your choice.
                    Assign users to roles and control which user or role gets 
                    access to which resource within your app. The Access Control 
                    List (ACL) stays up-to-date across all your app instances 
                    thanks to the reactive database layer.
                  </div>   
                </li>
                <li>
                  <div className="title">Slack and Emails</div>
                  <div className="descripton">
                    Built-in configurable notifications via email and Slack. 
                    Target notifications to specific user roles and trigger them
                    from any part of your app. The emailing system system 
                    builds on nodemailer, and enables you to use any of its 
                    supported adapters. Emails are markdown templates
                  </div>   
                </li>
                <li>
                  <div className="title">Scheduled Tasks</div>
                  <div className="descripton">
                    The built-in Cron system allows you to schedule tasks. 
                    Tasks run within the full application context, so you can 
                    access the database, fire off emails and notify the admins 
                    once everything is done.
                  </div>   
                </li>
                <li>
                  <div className="title">Quick Setup</div>
                  <div className="descripton">
                    Get a skeleton app setup quickly using the command-line client.
                    It can even provide gulp scripts to enable an auto-reloading 
                    development server coupled with live reload in the browser. Now 
                    you can focus on building your app without having to worry 
                    about the boilerplate.
                  </div>   
                </li>
              </ul>
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
