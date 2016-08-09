#!/usr/bin/env node
"use strict";

const shell = require('shelljs'),
  path = require('path');


function exec(cmd) {
  let ret = shell.exec(cmd);

  if (0 !== ret.code) {
    throw new Error(`Error executing: ${cmd}`, ret.stderr);
  }

  return ret.stdout;
}

// clone waigo
exec('git clone --depth 1 https://github.com/waigo/waigo.git ' + path.join(__dirname, '..', 'waigo'));

