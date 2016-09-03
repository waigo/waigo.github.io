import _ from 'lodash';
import path from 'path';
import React from 'react';
import { Link } from 'react-router';
import HtmlToReact from 'html-to-react';
import DocumentTitle from 'react-document-title';
import Classnames from 'classnames';
import { config } from 'config';
import UrlUtils from '../utils/url';
import Header from './header';
import Footer from './footer';
import SideNavLayout from './sideNavLayout';



const NAV = {
  children: require('../data/apiNav.json').map((id) => {
    return {
      label: id,
      url: `${config.apiBaseUrl}/${id}`,
    };
  }),
};


export default class ApiTemplate extends React.Component {
  render () {
    const page = this.props.page;

    return (
      <DocumentTitle title='API'>
        <div className="page api">
          <Header activeNav="api" />
          <SideNavLayout nav={NAV} page={page}>
            Coming soon...
          </SideNavLayout>
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
  
}


ApiTemplate.propTypes = {
  page: React.PropTypes.object,
};
