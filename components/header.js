import React from 'react';
import { Link } from 'react-router';
import { prefixLink } from 'gatsby-helpers';
import Headroom from 'react-headroom';
import { config } from 'config';



const NAV = [
  {
    label: 'Get started',
    title: 'Get started',
    link: prefixLink('/get_started/'),
    tag: 'get_started',
  },
  {
    label: 'Docs',
    title: 'Documentation',
    link: prefixLink('/docs/'),
    tag: 'docs',
  }
];


export default class Header extends React.Component {
  render () {
    const activeNav = this.props.activeNav;

    let header = null;

    if (this.props.show) {
      const navItems = NAV.map((item) => (
        <li key={item.tag}>
          <Link 
            title={item.title}
            to={item.link} 
            className={activeNav === item.tag ? 'active' : null}>
              {item.label}
          </Link>
        </li>
      ));

      header = (
        <header>
          <section className="brand">
            <Link to={prefixLink('/')}>
              Waigo.js
            </Link>
          </section>
          <ul className="nav">
            {navItems}
            <li key="twitter">
              <a title="Twitter" href='https://www.twitter.com/waigojs'>
                <i className="twitter" />
              </a>
            </li>
          </ul>
        </header>
      );
    }

    return (
      <Headroom>
        {header}
      </Headroom>
    );
  }
}


Header.propTypes = {
  activeNav: React.PropTypes.string,
  show: React.PropTypes.bool,
};

Header.defaultProps = {
  activeNav: null,
  show: true,
};




