#!/usr/bin/env node
"use strict";

const _ = require('lodash'),
  Q = require('bluebird'),
  path = require('path');

const DIR = path.join(__dirname, '..');


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


const Utils = require('./includes/utils').create(argv);


Q.coroutine(function*() {
  yield* copyFonts();
  yield* cloneWaigo();
  yield* createGuideDocs();
})()
  .then(() => {
    Utils.logAction('Setup complete.');
  })
  .error(Utils.logError);


function* copyFonts() {
  // copy in fonts
  Utils.exec('rm -rf ' + path.join(DIR, 'pages/fonts'));
  Utils.exec('mkdir -p ' + path.join(DIR, 'pages/fonts'));
  Utils.exec('cp ' + path.join(DIR, 'node_modules/fa-stylus/fonts/*') + ' ' + path.join(DIR, 'pages/fonts'));
}

function* cloneWaigo() {
  // clone waigo
  if (!argv['skip-clone']) {
    Utils.exec('rm -rf ' + path.join(DIR, 'waigo'));
    Utils.exec('git clone --depth 1 https://github.com/waigo/waigo.git ' + path.join(DIR, 'waigo'));
  }
}

function* createGuideDocs() {
  const docsNav = {
    url: '/docs',
    children: {},
  }, docsExtraData = [],
  docsRepoPaths = [];

  // copy docs
  yield Utils.walkFolder(path.join(DIR, 'waigo/docs'), /\.(md|png|jpg|jpeg|gif)$/i, (file) => {
    // build destination filename
    let relativePath = file.substr(path.join(DIR, 'waigo/docs/').length),
      finalFile = path.join(DIR, 'pages/docs', relativePath.toLowerCase()),
      finalFolder = path.dirname(finalFile);

    // if it's not markdown then just copy it over
    if (path.extname(file).toLowerCase() !== '.md') {
      Utils.exec(`cp ${file} ${finalFile}`);

      return;
    }

    // read content
    let content = Utils.readFile(file);

    Utils.logAction(`Updating links in content`);

    // remove ".md" and lowercase the links
    content = content
      .replace(/\.md\)/img, '/)')
      .replace(/\]\(.+\/\)/img, (str) => str.toLowerCase());

    Utils.logAction(`Writing front-matter`);

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
        Utils.logError(`Skipping ${finalFile} because parent node not found.`);
      }
    } else if ('docs' !== parentNodeName) {
      // grab image links from within content
      Utils.logAction(`Finding image links`);

      let imgRegex = /\!\[.*\]\((.+)\)/img,
        images = [],
        m;
      while ( (m = imgRegex.exec(content)) ) {
        images.push(m[1]);
      }
      if (images.length) {
        Utils.logAction(`${images.length} images found`);
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
    Utils.exec(`mkdir -p ${finalFolder}`);

    // write to file
    Utils.writeFile(finalFile, content);
  });

  // save extra data to nodes
  docsExtraData.forEach((n) => {
    let docNode = _.get(docsNav, `children.${n.parent}.children.${n.child}`);
    
    if (!docNode) {
      Utils.logError(`Cannot find nav path: ${n.parent}.${n.child}`);
    } else {
      docNode.images = n.images;
      docNode.repoPath = n.repoPath;
    }
  });

  // write docs nav to data file
  Utils.exec('rm -rf ' + path.join(DIR, 'data'));
  Utils.exec('mkdir -p ' + path.join(DIR, 'data'));
  Utils.writeFile(path.join(DIR, 'data/docsNav.json'), JSON.stringify(docsNav, null, 2));  
}