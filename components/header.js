import React from 'react';
import { Link } from 'react-router';
import { prefixLink } from 'gatsby-helpers';
import Headroom from 'react-headroom';
import { config } from 'config';
import Classnames from 'classnames';



const NAV = [
  {
    label: 'Guide',
    title: 'Documentation guide',
    link: prefixLink(config.docsLink),
    tag: 'docs',
  },
  {
    label: <i className="twitter" />,
    title: 'Twitter',
    link: config.twitterUrl,
    tag: 'twitter',
    type: 'social',
    external: true,
  },
  {
    label: <i className="github" />,
    title: 'Github',
    link: config.githubUrl,
    tag: 'github',
    type: 'social',
    external: true,
  },
  {
    label: <i className="discuss" />,
    title: 'Discuss',
    link: config.discussUrl,
    tag: 'discuss',
    type: 'social',
    external: true,
  },
];


export default class Header extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      mobileActive: null,
    };

    _.bindAll(this, '_toggleMobileMenu');
  }


  render () {
    const activeNav = this.props.activeNav;

    let header = null;

    if (this.props.show) {
      const navItems = NAV.map((item) => {
        let lnk;

        if (item.external) {
          lnk = (<a
            title={item.title}
            href={item.link} 
            className={Classnames({active: activeNav === item.tag})}>
              {item.label}
          </a>);
        } else {
          lnk = (<Link 
            title={item.title}
            to={item.link} 
            className={Classnames({active: activeNav === item.tag})}>
              {item.label}
          </Link>);
        }

        return (
          <li key={item.tag} className={Classnames(item.type)}>{lnk}</li>
        );
      });

      header = (
        <header>
          <section className="brand">
            <Link to={prefixLink('/')}>
              Waigo.js
            </Link>
          </section>
          <button 
            className="mobile-toggle"
            onClick={this._toggleMobileMenu}>
              <i className={Classnames('menu', {open: this.state.mobileActive})} />
          </button>
          <ul className={Classnames('nav', { active: this.state.mobileActive})}>
            {navItems}
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


  _toggleMobileMenu (e) {
    e.preventDefault();

    this.setState({
      mobileActive: !this.state.mobileActive,
    });
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




