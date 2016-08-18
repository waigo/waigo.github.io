import _ from 'lodash';
import path from 'path';
import React from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';
import HtmlToReact from 'html-to-react';
import Classnames from 'classnames';
import { config } from 'config';
import Header from './header';
import Footer from './footer';
import UrlUtils from '../utils/url';


const NAV = require('../data/docsNav.json');

const NAV_FLAT = _.flatMap(NAV.children, (info, id) => {
  return [{
    label: info.label,
    url: info.url,
  }].concat(_.map(info.children || [], v => {
    return {
      label: `${info.label}: ${v.label}`,
      url: v.url,
    }
  }));
});


export default class Layout extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      mobileVisible: false,
    };

    _.bindAll(this, '_toggleMobileNav');
  }

  componentWillReceiveProps(newProps) {
    // hide mobile nav menu if path changed (which means user probably clicked an item in the nav menu)
    if (newProps.page.path !== this.props.page.path) {
      this.setState({
        mobileVisible: false,
      });
    }
  }

  render () {
    const page = this.props.page;

    let navMenu = this._buildNavMenu(NAV, page.path),
      content = this._buildContent(page.data.body, page);

    return (
      <DocumentTitle title={`${page.data.title} | ${config.siteTitle}`}>
        <div className="page docs">
          <Header activeNav="docs" />
          <main>
            <button
              className="nav mobile"
              title="Toggle nav menu"
              onClick={this._toggleMobileNav}>
                <i className={Classnames('arrow', this.state.mobileVisible ? 'left' : 'right')} />
            </button>
            <aside className={Classnames({'mobile visible': this.state.mobileVisible})}>
              {navMenu}
            </aside>
            <section className="content">
              {content}
            </section>
          </main>
          <Footer />
        </div>
      </DocumentTitle>
    );
  }


  _toggleMobileNav (e) {
    e.preventDefault();

    this.setState({
      mobileVisible: !this.state.mobileVisible,
    });
  }

  _buildContent (htmlStr, page) {
    let currentPath = page.path,
      isLeaf = ('index.md' !== page.file.basename);

    /* replace all internal Anchor links to <Link /> tags  */

    let processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);

    let processingInstructions = [
      {
        // Custom <a> processing
        shouldProcessNode: (node) => {
          // only want anchor tags with internal links
          return _.get(node, 'name', '') === 'a'
            && 0 > _.get(node, 'attribs.href', '://').indexOf('://');
        },
        processNode: (node, children) => {
          let href = node.attribs.href;

          href = (isLeaf ? '../' : './') + href;

          let p = UrlUtils.trailingSlashIt(path.resolve(currentPath, href));

          return (
            <Link to={p}>{_.get(node, 'children.0.data')}</Link>
          );
        }
      },
      {
        shouldProcessNode: (node) => {
          return _.get(node, 'name', '') === 'code' && _.get(node, 'parent.name') === 'pre';
        },
        processNode: (node, children) => {
          node.attribs.class += ' hljs';

          return processNodeDefinitions.processDefaultNode.call(this, node, children);
        }
      },
      {
        // Anything else
        shouldProcessNode: function(node) {
          return true;
        },
        processNode: processNodeDefinitions.processDefaultNode
      }
    ];

    let htmlToReactParser = new HtmlToReact.Parser(React);

    const content = htmlToReactParser.parseWithInstructions(
      `<div>${htmlStr}</div>`, () => true, processingInstructions
    );

    let prevNext = this._calculatePrevAndNextNavLinks(NAV_FLAT, currentPath);

    let prev = !prevNext.prev ? null : (
      <Link to={UrlUtils.trailingSlashIt(prevNext.prev.url)}
        className="prev">&laquo; {prevNext.prev.label}</Link>
    );

    let next = !prevNext.next ? null : (
      <Link to={UrlUtils.trailingSlashIt(prevNext.next.url)}
        className="next">{prevNext.next.label} &raquo;</Link>
    );

    return (
      <div>
        {content}
        <div className="prev-next">{prev}{next}</div>
      </div>
    );
  }


  _buildNavMenu (nav, currentPath, level) {
    level = level || 0;

    let links = [],
      idx = level * 1000;

    for (let id in nav.children) {
      let info = nav.children[id];

      let sublist = (_.isEmpty(info.children))
        ? null
        : this._buildNavMenu(info, currentPath, level+ 1);

      let link = (
        <Link to={info.url + '/'}>{info.label}</Link>
      );

      let classes = {};

      if (0 <= currentPath.indexOf(info.url)) {
        classes.active = true;
      }

      links.push(
        <li key={idx++} className={Classnames(classes)}>{link}{sublist}</li>
      );
    }

    return (
      <ul>{links}</ul>
    );
  }


  _calculatePrevAndNextNavLinks(navFlat, currentPath) {
    let prev;

    let ret = {};

    for (let i in navFlat) {
      let info = navFlat[i];

      if (0 <= currentPath.indexOf(info.url)) {
        ret = {
          prev: prev,
          current: info,
        };

        /* we keep going since we may find a more specific match further down
        the chain */
      }
      // set next item
      else if (prev === ret.current) {
        ret.next = info;
      }

      prev = info;
    }

    return ret;
  }
}




Layout.propTypes = {
  page: React.PropTypes.object,
};
