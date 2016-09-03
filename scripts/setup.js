#!/usr/bin/env node
"use strict";

const _ = require('lodash'),
  docLite = require('documentation-lite'),
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
  yield* createApiDocs();
})()
  .then(() => {
    Utils.logAction('Setup done.');
  })
  .error(Utils.logError);


function* copyFonts() {
  Utils.logAction('Copy fonts...');

  // copy in fonts
  Utils.rm(path.join(DIR, 'pages/fonts'));
  Utils.mkdir(path.join(DIR, 'pages/fonts'));
  Utils.cp(path.join(DIR, 'node_modules/fa-stylus/fonts/*'), path.join(DIR, 'pages/fonts'));
}

function* cloneWaigo() {
  // clone waigo
  if (!argv['skip-clone']) {
    Utils.logAction('Clone waigo...');

    Utils.rm(path.join(DIR, 'waigo'));
    Utils.exec('git clone --depth 1 https://github.com/waigo/waigo.git ' + path.join(DIR, 'waigo'));
  }
}

function* createGuideDocs() {
  Utils.logAction('Creating guide docs...');
  
  let guideNav = {
    url: '/docs',
    children: {},
  }, docsExtraData = [],
  docsRepoPaths = [];

  // copy docs
  yield Utils.walkFolder(path.join(DIR, 'waigo/docs'), /\.(md|png|jpg|jpeg|gif)$/i, function*(file) {
    // build destination filename
    let relativePath = file.substr(path.join(DIR, 'waigo/docs/').length),
      finalFile = path.join(DIR, 'pages/docs', relativePath.toLowerCase()),
      finalFolder = path.dirname(finalFile);

    // if it's not markdown then just copy it over
    if (path.extname(file).toLowerCase() !== '.md') {
      Utils.cp(file, finalFile);

      return;
    }

    // read content
    let content = yield Utils.readFile(file);

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
      ? guideNav
      : guideNav.children[parentNodeName];
    
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
        if (guideNav !== parentNode) {
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
    Utils.mkdir(finalFolder);

    // write to file
    yield Utils.writeFile(finalFile, content);
  });
  
  // save extra data to nodes
  docsExtraData.forEach((n) => {
    let docNode = _.get(guideNav, `children.${n.parent}.children.${n.child}`);
    
    if (!docNode) {
      Utils.logError(`Cannot find nav path: ${n.parent}.${n.child}`);
    } else {
      docNode.images = n.images;
      docNode.repoPath = n.repoPath;
    }
  });

  // write docs nav to data file
  Utils.rm(path.join(DIR, 'data'));
  Utils.mkdir(path.join(DIR, 'data'));
  yield Utils.writeFile(path.join(DIR, 'data/guideNav.json'), JSON.stringify(guideNav, null, 2));  
}



function* createApiDocs() {
  Utils.logAction('Create API docs...');

  Utils.rm(path.join(DIR, 'pages/api'));
  
  let toProcess = [];

  yield Utils.walkFolder(path.join(DIR, 'waigo/src'), /\.(js)$/i, function*(file) {
    // build destination filename
    const relativePath = file.substr(path.join(DIR, 'waigo/src/').length),
      inputFileName = path.basename(relativePath, '.js'),
      relativePathNoExt = path.join(path.dirname(relativePath), inputFileName);
      
    let finalFile = path.join(DIR, 'pages/api', relativePathNoExt);
    // if filename is index.js then we need to create another subfolder within output folder
    // because gatsby auto-treats index files as if they're default file for the containing folder
    if (inputFileName === 'index') {
      finalFile = path.join(finalFile, 'index');
    }
    finalFile += '.json';
    
    const finalFolder = path.dirname(finalFile);
      
    // skip cli/data
    if (0 <= relativePathNoExt.indexOf("cli/data")) {
      return;
    }
      
    // create folder
    Utils.mkdir(finalFolder);

    // add to processing list
    toProcess.push({
      nav: relativePathNoExt,
      inputFile: file,
      outputFile: finalFile,
    });
  });
  
  Utils.logAction('Create API JSON files...');

  yield Q.all(toProcess.map((item) => {
    return docLite.processFile(item.inputFile, {
      includeCode: true
    })
    .then((json) => {
      return Utils.writeFile(item.outputFile, JSON.stringify(json, null, 2));
    });
  }));

  Utils.logAction('Create root index.json file...');

  yield Utils.writeFile(path.join(DIR, 'pages/api/index.json'), JSON.stringify({
    file: {
      description: [
        'Welcome to the Waigo API docs.',
        'Use the menu on the left to navigate to different files.'
      ]
    }
  }, null, 2));
  
  Utils.logAction('Create API nav...');

  let navList = _.sortBy(toProcess, (i) => i.nav)
    .map((i) => i.nav)
    .filter((i) => (i !== 'index' && i !== 'loader'));
  
  yield Utils.writeFile(
    path.join(DIR, 'data', 'apiNav.json'), 
    JSON.stringify(navList, null, 2)
  );
}

