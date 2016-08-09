#!/usr/bin/env node

const shell = require('shelljs');

shell.cp('CNAME', 'public');
shell.cp('img/favicon.*', 'public');
