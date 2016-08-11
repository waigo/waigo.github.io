#!/usr/bin/env node

const shell = require('shelljs');

shell.cp('CNAME', 'public');
shell.cp('pages/img/logo.ico', 'public/favicon.ico');
