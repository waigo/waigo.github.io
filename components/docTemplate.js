import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';
import Classnames from 'classnames';
import Header from './header';
import Footer from './footer';

const NAV = require('../data/docsNav');



export default class Layout extends React.Component {
  render () {
    const page = this.props.page;

    let navMenu = this._buildNavMenu(NAV, page);
    console.log(page);

/*            <section 
              className="content" 
              dangerouslySetInnerHTML={{ __html: page.data.body }} />
*/
    return (
      <DocumentTitle title={page.data.title}>
        <div className="page docs">
          <Header activeNav="docs" />
          <main>
            <aside>{navMenu}</aside>
          </main>
          <Footer />
        </div>
      </DocumentTitle>
    );
  }


  _buildNavMenu (nav, page, level) {
    level = level || 0;

    let links = [],
      idx = level * 1000;

    for (let id in nav.children) {
      let info = nav.children[id];

      let sublist = (_.isEmpty(info.children)) 
        ? null 
        : this._buildNavMenu(info, page, level+ 1);

      let link = (
        <Link to={info.url + '/'}>{info.label}</Link>
      );

      let classes = {};
      if (0 <= page.path.indexOf(info.url)) {
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

