#!/usr/bin/env node
"use strict";

const Q = require('bluebird'),
  fs = require('fs'),
  shell = require('shelljs'),
  path = require('path'),
  walk = require('findit');


const argv = require('yargs')
  .usage('Usage: $0 [options]')
  .option({
    'skip-clone': {
        demand: false,
        describe: 'Skip cloning waigo repo, use existing.',
        type: ' boolean',
    },
    'verbose': {
        alias: 'v',
        demand: false,
        describe: 'Verbose logging.',
        type: ' boolean',
    },
  })
  .help('h')
  .alias('h', 'help')
  .parse(process.argv.slice(1));


const DIR = path.join(__dirname, '..');


function logCmd(str) {
  if (argv.verbose) {
    console.log(`\n>> ${str}`);
  }
}


function exec(cmd) {
  logCmd(cmd);

  let ret = shell.exec(cmd);

  if (0 !== ret.code) {
    throw new Error(`Error executing: ${cmd}`, ret.stderr);
  }

  return ret.stdout;
}

function readFile(file) {
  logCmd(`readFile: ${file}`);

  return fs.readFileSync(file, {encoding:"utf-8"}).toString();
}

function writeFile(file, contents) {
  logCmd(`writeFile: ${file}`);

  return fs.writeFileSync(file, contents, {encoding:'utf-8'});
}


function walkFolder(rootFolder, regex, cb) {
  return new Promise(function(resolve, reject) {
    let done = false;

    let walker = walk(rootFolder, {
      followSymlinks: false
    });

    walker.on('file', function(file, stat) {
      if (done) {
        return;
      }

      var dirname = path.dirname(file),
        filename = path.join(path.relative(rootFolder, dirname), path.basename(file));

      if (!filename.match(regex)) {
        return;
      }

      try {
        cb(file);
      } catch (err) {
        done = true;

        return reject(err);
      }
    });  

    walker.on('end', function() {
      if (done) {
        return;
      }

      resolve();
    });  
  });
}


Q.coroutine(function*() {

  // copy in fonts
  exec('rm -rf ' + path.join(DIR, 'pages/fonts'));
  exec('mkdir -p ' + path.join(DIR, 'pages/fonts'));
  exec('cp ' + path.join(DIR, 'node_modules/fa-stylus/fonts/*') + ' ' + path.join(DIR, 'pages/fonts'));

  // clone waigo
  if (!argv['skip-clone']) {
    exec('rm -rf ' + path.join(DIR, 'waigo'));
    exec('git clone --depth 1 https://github.com/waigo/waigo.git ' + path.join(DIR, 'waigo'));    
  }

  // create docs markdown
  exec('rm -rf ' + path.join(DIR, 'pages/docs'));
  exec('cp -rf ' + path.join(DIR, 'waigo/docs') + ' ' + path.join(DIR, 'pages/docs'));

  // go through doc files
  const docsNav = {
    url: '/docs',
    children: {},
  };

  yield walkFolder(path.join(DIR, 'pages/docs'), /\.md/i, (file) => {
    let content = readFile(file);

    // if README.md then extract links
    if (0 < file.indexOf('README.md')) {
      let re = /^\*\s+\[(.+)\]\((.+)(\/|\.md)\)$/igm,
        links = [],
        m;

      while ( (m = re.exec(content)) !== null ) {
        links.push(m);
      }

      let parentFolder = path.dirname(file).split(path.sep).pop();

      let parentNode =  ('docs' === parentFolder) 
        ? docsNav
        : docsNav.children[parentFolder];

      if (parentNode) {
        links.forEach((l) => {
          let label = l[1],
            subFolder = l[2];

          parentNode.children[subFolder] = {
            label: label,
            url: `${parentNode.url}/${subFolder}`,
            children: {},
          };
        });
      } else {
        console.log(`Skipping ${file} because parent node not found.`);
      }
    }

    logCmd(`Updating links in ${file}`);

    // replace .md links
    content = content.replace(/\.md\)/img, '/)');

    logCmd(`Writing front-matter to ${file}`);

    // write front matter
    let title = content.match(/#\s(.+)\n/i);
    if (title && title[1]) {
      content = `---\ntitle: ${title[1]}\n---\n${content}`;
    }

    // write to file
    writeFile(file, content);

    // rename README.md -> index.md
    if (0 < file.indexOf('README.md')) {
      let newName = file.replace('README.md', 'index.md');
      
      exec(`mv ${file} ${newName}`);
    }
  });

  // write docs nav to data file
  exec('rm -rf ' + path.join(DIR, 'data'));
  exec('mkdir -p ' + path.join(DIR, 'data'));
  writeFile(path.join(DIR, 'data/docsNav.json'), JSON.stringify(docsNav, null, 2));
})()
  .then(() => {
    console.log('Setup complete.');
  })
  .error(console.error);
