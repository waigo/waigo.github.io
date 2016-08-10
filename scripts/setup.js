#!/usr/bin/env node
"use strict";

const Q = require('bluebird'),
  shell = require('shelljs'),
  path = require('path'),
  walk = require('findit');


const DIR = path.join(__dirname, '..');


function exec(cmd) {
  console.log(`\n>> ${cmd}`);

  let ret = shell.exec(cmd);

  if (0 !== ret.code) {
    throw new Error(`Error executing: ${cmd}`, ret.stderr);
  }

  return ret.stdout;
}


function findFiles(rootFolder, regex) {
  return new Promise(function(resolve, reject) {
    let files = {};

    let walker = walk(rootFolder, {
      followSymlinks: false
    });

    walker.on('file', function(file, stat) {
      var dirname = path.dirname(file),
        filename = path.join(path.relative(rootFolder, dirname), path.basename(file));

      if (!filename.match(regex)) {
        return;
      }

      files[filename] = file;
    });  

    walker.on('end', function() {
      resolve(files);
    });  
  });
}



Q.coroutine(function*() {

  // copy in fonts
  exec('cp ' + path.join(DIR, 'node_modules/fa-stylus/fonts/*') + ' ' + path.join(DIR, 'pages/fonts'));

  // clone waigo
  exec('rm -rf ' + path.join(DIR, 'waigo'));
  exec('git clone --depth 1 https://github.com/waigo/waigo.git ' + path.join(DIR, 'waigo'));

  // create docs markdown
  exec('rm -rf ' + path.join(DIR, 'pages/docs'));
  exec('cp -rf ' + path.join(DIR, 'waigo/docs') + ' ' + path.join(DIR, 'pages/docs'));

  // get all README.md
  let readmeFiles = yield findFiles(path.join(DIR, 'pages/docs'), /README\.md/i);

  // rename them
  for (let key in readmeFiles) {
    let newName = readmeFiles[key].replace('README.md', 'index.md');

    exec(`mv ${readmeFiles[key]} ${newName}`);
  }
})()
  .error(console.error);
