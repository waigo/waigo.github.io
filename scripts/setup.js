#!/usr/bin/env node
"use strict";

const shell = require('shelljs'),
  path = require('path');


const DIR = path.join(__dirname, '..');


function exec(cmd) {
  let ret = shell.exec(cmd);

  if (0 !== ret.code) {
    throw new Error(`Error executing: ${cmd}`, ret.stderr);
  }

  return ret.stdout;
}


// copy in fonts
exec('cp ' + path.join(DIR, 'node_modules/fa-stylus/fonts/*') + ' ' + path.join(DIR, 'pages/fonts'));

// clone waigo
exec('rm -rf ' + path.join(DIR, 'waigo'));
exec('git clone --depth 1 https://github.com/waigo/waigo.git ' + path.join(DIR, 'waigo'));

