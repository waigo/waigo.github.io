import _ from 'lodash';
import path from 'path';
import React from 'react';
import { Link } from 'react-router';
import HtmlToReact from 'html-to-react';
import Classnames from 'classnames';
import { config } from 'config';
import UrlUtils from '../utils/url';
import NavUtils from '../utils/nav';


export default class SideNavLayout extends React.Component {
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

    const navMenu = this._buildNavMenu(this.props.nav, page.path),
      prevNext = this._calculatePrevAndNextNavLinks(NavUtils.flatten(this.props.nav), page.path);

    const prev = !prevNext.prev ? null : (
      <Link to={UrlUtils.trailingSlashIt(prevNext.prev.url)}
        className="prev">&laquo; {prevNext.prev.label}</Link>
    );

    const next = !prevNext.next ? null : (
      <Link to={UrlUtils.trailingSlashIt(prevNext.next.url)}
        className="next">{prevNext.next.label} &raquo;</Link>
    );

    return (
      <main className="side-nav-layout">
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
          {this.props.children}
          <div className="prev-next">{prev}{next}</div>
        </section>
      </main>
    );
  }


  _toggleMobileNav (e) {
    e.preventDefault();

    this.setState({
      mobileVisible: !this.state.mobileVisible,
    });
  }

  _buildNavMenu (nav, currentPath, level) {
    level = level || 0;

    let links = [],
      idx = level * 1000,
      activeLink = null;

    for (let id in nav.children) {
      let info = nav.children[id];

      let sublist = (_.isEmpty(info.children))
        ? null
        : this._buildNavMenu(info, currentPath, level+ 1);

      let link = (
        <Link to={`${info.url}/`}>{info.label}</Link>
      );

      let linkData = {
        link: link,
        sublist: sublist,
        classes: {},
      };
      
      if (0 <= currentPath.indexOf(info.url)) {
        activeLink = linkData;
      }

      links.push(linkData);
    }

    links = links.map((link, idx) => {
      if (link === activeLink) {
        link.classes.active = true;
      }
      
      return <li key={idx++} className={Classnames(link.classes)}>{link.link}{link.sublist}</li>
    });

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


SideNavLayout.propTypes = {
  nav: React.PropTypes.object,
  page: React.PropTypes.object,
};
