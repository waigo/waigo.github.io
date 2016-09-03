#!/usr/bin/env node
"use strict";

const _ = require('lodash'),
  path = require('path'),
  shell = require('shelljs');
  
const DATA_SRC_DIR = path.join(__dirname, '..', 'data'),
  PAGES_SRC_DIR = path.join(__dirname, '..', 'pages'),
  BUILD_DIR = path.join(__dirname, '..', 'public');  
  
const Utils = require('./includes/utils').create({
  verbose: true
});

Utils.logAction('Running post-build steps...');

Utils.cp('CNAME', BUILD_DIR);
Utils.cp('pages/img/logo.ico', path.join(BUILD_DIR, 'favicon.ico'));
Utils.cp('node_modules/fa-stylus/fonts/*', path.join(BUILD_DIR, 'fonts'));
Utils.cp('v1', path.join(BUILD_DIR, 'v1'));

// copy images
(function copyImages(node) {
  if (_.get(node, 'images.length')) {
    let srcPath = path.join(PAGES_SRC_DIR, path.dirname(node.url)),
      dstPath = path.join(BUILD_DIR, node.url);

    _.each(node.images, (i) => {
      Utils.cp(path.join(srcPath, i), path.join(dstPath, i));
    });
  }

  _.each(node.children || {}, (c) => {
    copyImages(c);
  });
})(require(path.join(DATA_SRC_DIR, 'guideNav.json')));

Utils.logAction('Post-build done.');


