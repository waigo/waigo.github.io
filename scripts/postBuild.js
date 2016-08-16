#!/usr/bin/env node

const shell = require('shelljs');

shell.cp('CNAME', 'public');
shell.cp('pages/img/logo.ico', 'public/favicon.ico');
shell.cp('node_modules/fa-stylus/fonts/*', 'public/fonts');
shell.cp('-rf', 'v1', 'public/v1');
