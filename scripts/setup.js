#!/usr/bin/env node
"use strict";

const _ = require('lodash'),
  Q = require('bluebird'),
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

  const docsNav = {
    url: '/docs',
    children: {},
  }, docsExtraData = [],
  docsRepoPaths = [];

  // copy docs
  yield walkFolder(path.join(DIR, 'waigo/docs'), /\.(md|png|jpg|jpeg|gif)$/i, (file) => {
    // build destination filename
    let relativePath = file.substr(path.join(DIR, 'waigo/docs/').length),
      finalFile = path.join(DIR, 'pages/docs', relativePath.toLowerCase()),
      finalFolder = path.dirname(finalFile);

    // if it's not markdown then just copy it over
    if (path.extname(file).toLowerCase() !== '.md') {
      exec(`cp ${file} ${finalFile}`);

      return;
    }

    // read content
    let content = readFile(file);

    logCmd(`Updating links in content`);

    // remove ".md" and lowercase the links
    content = content
      .replace(/\.md\)/img, '/)')
      .replace(/\]\(.+\/\)/img, (str) => str.toLowerCase());

    logCmd(`Writing front-matter`);

    // write front matter
    let title = content.match(/#\s(.+)\n/i);
    if (title && title[1]) {
      content = `---\ntitle: ${title[1]}\n---\n${content}`;
    }

    // get parent node
    let parentNodeName = finalFolder.split(path.sep).pop();
    let parentNode =  ('docs' === parentNodeName)
      ? docsNav
      : docsNav.children[parentNodeName];

    // README.md?
    if (0 <= finalFile.indexOf('readme.md')) {      
      // README.md -> index.md
      finalFile = finalFile.replace('readme.md', 'index.md');

      // grab links from within content
      let re = /^\*\s+\[(.+)\]\((.+)(\/|\.md)\)$/igm,
        links = [],
        m;
      while ( (m = re.exec(content)) !== null ) {
        links.push(m);
      }

      if (parentNode) {
        // repo path
        if (docsNav !== parentNode) {
          parentNode.repoPath = relativePath;        
        }
        
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
        console.error(`Skipping ${finalFile} because parent node not found.`);
      }
    } else if ('docs' !== parentNodeName) {
      // grab image links from within content
      logCmd(`Finding image links`);

      let imgRegex = /\!\[.*\]\((.+)\)/img,
        images = [],
        m;
      while ( (m = imgRegex.exec(content)) ) {
        images.push(m[1]);
      }
      if (images.length) {
        logCmd(`${images.length} images found`);
      }

      const childNodeName = path.basename(finalFile, path.extname(finalFile));

      docsExtraData.push({
        parent: parentNodeName,
        child: childNodeName,
        images: images,
        repoPath: relativePath,
      });
    }

    // create final folder
    exec(`mkdir -p ${finalFolder}`);

    // write to file
    writeFile(finalFile, content);
  });

  // save extra data to nodes
  docsExtraData.forEach((n) => {
    let docNode = _.get(docsNav, `children.${n.parent}.children.${n.child}`);
    
    if (!docNode) {
      console.error(`Cannot find nav path: ${n.parent}.${n.child}`);
    } else {
      docNode.images = n.images;
      docNode.repoPath = n.repoPath;
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
