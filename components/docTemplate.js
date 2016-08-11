import _ from 'lodash';
import path from 'path';
import React from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';
import HtmlToReact from 'html-to-react';
import Classnames from 'classnames';
import Header from './header';
import Footer from './footer';


const NAV = require('../data/docsNav');



export default class Layout extends React.Component {
  render () {
    const page = this.props.page;
    console.log(page);

    let navMenu = this._buildNavMenu(NAV, page.path),
      content = this._buildContent(page.data.body, page);

    return (
      <DocumentTitle title={page.data.title}>
        <div className="page docs">
          <Header activeNav="docs" />
          <main>
            <aside>{navMenu}</aside>
            <section className="content">{content}</section>
          </main>
          <Footer />
        </div>
      </DocumentTitle>
    );
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

          let p = path.resolve(currentPath, href);

          if ('/' !== p.charAt(p.length-1)) {
            p += '/';
          }

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

    return htmlToReactParser.parseWithInstructions(
      `<div>${htmlStr}</div>`, () => true, processingInstructions
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
}


Layout.propTypes = {
  page: React.PropTypes.object,
};

