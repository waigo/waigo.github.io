var _ = require('lodash'),
  fs = require('fs'),
  jade = require('jade'),
  cheerio = require('cheerio'),
  marked = require( "marked" ),
  path = require('path'),
  Promise = require('bluebird'),
  sass = require('node-sass'),
  shell = require('shelljs'),
  uglify = require('uglify-js'),
  walk = require('findit');


marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});


Promise.promisifyAll(fs);



/** 
 * Rebuild docs.
 * @param  {Object} options build options.
 * @return {Promise}
 */
exports.rebuild = function(options) {
  var tasks = {
    images: [ compileImages ],
    styles: [ compileStyles ],
    scripts: [ compileJs ],
    mainpages: [ compileTemplates ],
    examples: [ compileExamples ],
    api: [ compileApiDocs ]
  };

  var tasksToBeDone;
  if (options.limitTo) {
    tasksToBeDone = tasks[options.limitTo];
  } else {
    tasksToBeDone = _.flatten(_.values(tasks));
  }

  return Promise.all(
    tasksToBeDone.map(function(t) {
      return t(options);
    })
  );
};




/**
 * Compile HTML template.
 * @param  {Object} options build options
 * @return {Promise}
 */
var compileTemplates = function(options) {
  console.log('--> Compiling templates');
  
  var templatesFolder = path.join(options.srcFolder, 'templates'),
    userGuideFile = path.join(options.repoFolder, 'README.md');

  return Promise.all([
    Promise.try(function() {
     return fs.readFileAsync(userGuideFile, { encoding: 'utf-8' })
        .then(function(markdownContent) {
          return marked(markdownContent);
        })
        .then(function(html) {
          return Promise.all([
            html,
            extractNavMenu(html)
          ]);
        })
        .spread(function(html, navMenu){
          var pageHtml = jade.renderFile(path.join(templatesFolder, 'guide.jade'), { 
            siteNav: 'guide',
            content: html, 
            menu: navMenu 
          });
          return fs.writeFileAsync(path.join(options.buildFolder, 'guide.html'), pageHtml, { encoding: 'utf-8' }); 
        });
    }),

    Promise.try(function() {
      var pageHtml = jade.renderFile(path.join(templatesFolder, 'index.jade'), { 
        siteNav: 'index',
        version: options.version,
      });
      return fs.writeFileAsync(path.join(options.buildFolder, 'index.html'), pageHtml, { encoding: 'utf-8' });            
    }),

    Promise.try(function() {
      var pageHtml = jade.renderFile(path.join(templatesFolder, 'sites.jade'), { 
        siteNav: 'sites',
        sites: require('./sites')
      });
      return fs.writeFileAsync(path.join(options.buildFolder, 'sites.html'), pageHtml, { encoding: 'utf-8' });            
    }),

  ]);
};





/** 
 * Compile Javascript.
 * @param  {Object} options build options.
 * @return {Promise}
 */
var compileJs = function(options) {
  console.log('--> Compiling scripts');
  return Promise.all([
    fs.readFileAsync(path.join(options.srcFolder, 'bower_components', 'jquery', 'dist', 'jquery.js'), { encoding: 'utf-8' }),
    fs.readFileAsync(path.join(options.srcFolder, 'bower_components', 'highlightjs', 'highlight.pack.js'), { encoding: 'utf-8' }),
    fs.readFileAsync(path.join(options.srcFolder, 'bower_components', 'parallax', 'deploy', 'jquery.parallax.js'), { encoding: 'utf-8' }),
    fs.readFileAsync(path.join(options.srcFolder, 'js', 'prism.js'), { encoding: 'utf-8' })
  ].concat(
    (['affix', 'transition', 'collapse', 'dropdown', 'scrollspy'].map(function(libName) {
      return fs.readFileAsync(path.join(options.srcFolder, 'bower_components', 'sass-bootstrap', 'js', libName + '.js'), { encoding: 'utf-8' });
    })),
    fs.readFileAsync(path.join(options.srcFolder, 'js', 'page.js'), { encoding: 'utf-8' })
  ))
    .then(function(results) {
      var jsCode = results.join(';');
      return uglify.minify(jsCode, {fromString: true}).code;
    })
    .then(function(compressedCode) {
      return fs.writeFileAsync(path.join(options.buildFolder, 'scripts.js'), compressedCode, { encoding: 'utf-8' });
    });
};




/** 
 * Compile images.
 * @param  {Object} options build options.
 * @return {Promise}
 */
var compileImages = function(options) {
  console.log('--> Compiling images');
  return Promise.try(function() {
    shell.rm('-rf', path.join(options.buildFolder, 'img'));
    shell.cp('-rf', path.join(options.srcFolder, 'img'), options.buildFolder);
  });
};




/**
 * Compile stylesheets.
 * @param  {Object} options build options.
 * @return {Promise}
 */
var compileStyles = function(options) {
  console.log('--> Compiling stylesheets');

  return new Promise(function(resolve, reject) {
    sass.render({
        file: path.join(options.srcFolder, 'sass', 'style.scss'),
        success: function(css){
          fs.writeFileAsync(path.join(options.buildFolder, 'style.css'), css, { encoding: 'utf-8' })
            .then(resolve)
            .catch(reject);
        },
        error: reject,
        includePaths: [ 
          path.join(options.srcFolder, 'bower_components', 'sass-bootstrap', 'lib'),
          path.join(options.srcFolder, 'bower_components', 'compass', 'frameworks', 'compass', 'stylesheets')
        ],
        outputStyle: 'compressed'
    });
  });
};



/**
 * Extract nav menu from given HTML.
 * @param  {String} html [description]
 * @return {Promise}
 */
var extractNavMenu = function(html) {
  return Promise.try(function() {
    var $ = cheerio.load(html);

    var navLinks = {},
      currentHeader = null;

    $('h1, h2').each(function(i, item) {
      var jqItem = $(this),
        id = jqItem.attr('id'),
        label = jqItem.text();

      if ('h1' === jqItem[0].name.toLowerCase()) {
        navLinks[id] = {
          label: label
        };
        currentHeader = navLinks[id];
      } else {
        if (!currentHeader.children) {
          currentHeader.children = {};
        }

        currentHeader.children[id] = {
          label: label
        }
      }
    });

    return navLinks;
  });
};




/**
 * Compile API docs.
 * @param  {Object} options build options.
 * @return {Promise}
 */
var compileApiDocs = function(options) {
    console.log('--> Compiling API docs');

  return Promise.try(function() {
    var apiDocsFolder = path.join(options.buildFolder, 'api');
    shell.rm('-rf', apiDocsFolder);
    var ret = shell.exec(
      process.cwd() + '/node_modules/.bin/doxx ' 
        + ' --template ' + path.join(options.srcFolder, 'templates', 'doxx.jade')
        + ' --ignore cli/data,views'
        + ' --source ' + path.join(options.repoFolder, 'src') 
        + ' --target ' + apiDocsFolder
    );
    if (0 !== ret.code) {      
      console.log(ret.output);
      throw new Error('Doxx failure: ' + ret.code);
    }    
  });
};



var LANGUAGE = {
  '.js': 'javascript',
  '.jade': 'jade'
};



/**
 * Compile Examples.
 * @param  {Object} options build options.
 * @return {Promise}
 */
var compileExamples = function(options) {
  console.log('--> Compiling Examples');

  var templatesFolder = path.join(options.srcFolder, 'templates'),
    outputFolder = path.join(options.buildFolder, 'examples');

  return Promise.try(function() {
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
    }
  })
    .then(function readFilesInExamplesRepo() {
      return fs.readdirAsync(options.examplesFolder);
    })
    .then(function processFilesInExamplesRepo(files) {

      // filter and reformat
      files = _.chain(files)
        .filter(function(f) {
          return '.git' !== f;
        })
        .map(function(f) {
          return path.join(options.examplesFolder, f);
        })
        .value();

      // only want the folders
      return Promise.all(
        _.map(files, function(f) {
          return fs.statAsync(f)
            .then(function(s) {
              return (s.isDirectory()) ? f : null;
            })       
        })
      )
        .then(function(dirs) {
          return _.filter(dirs);
        })
      ;
    })
    .then(function loadExamples(folders) {

      // inside each example
      return Promise.all(
        _.map(folders, function(folder) {
          // scan 'src' folder for all files
          return _walk(path.join(folder, 'src'))
            .then(function gotFiles(files) {
              // for each src file, load its contents
              return Promise.all(
                _.map(files, function(f) {
                  return fs.readFileAsync(f, { encoding: 'utf-8' })
                    .then(function gotContents(contents) {
                      var subPath = f.substr(f.indexOf('src/') + 4);
                      var ext = path.extname(f);

                      return {
                        path: subPath,
                        lang: LANGUAGE[ext],
                        contents: contents
                      };
                    });
                })
              );
            })
            .then(function gotSrcFileContents(files) {
              // load README file
              var pathToReadme = path.join(folder, 'README.md');

              return fs.readFileAsync(pathToReadme, { encoding: 'utf-8' })
                .then(function toMarkdown(markdownContent) {
                  return marked(markdownContent);
                })
                .then(function renderedReadme(readmeHtml) {
                  var title = cheerio.load(readmeHtml)('h1').text();
                  if (!title || '' === title) {
                    throw new Error('No H1 title found in: ' + pathToReadme);
                  }
                  return {
                    title: title,
                    slug: path.basename(folder),
                    readme: readmeHtml,
                    files: files,
                  }
                });
            });
        })
      );
    })
    .then(function renderExamples(examples) {
      var examplesNav = _.reduce(examples, function(result, example) {
        result.push({
          title: example.title,
          url: '/examples/' + example.slug + '.html'
        });
        return result;
      }, [{
        title: 'Introduction',
        url: '/examples/index.html'
      }]);

      return Promise.try(function() {
        var pageHtml = jade.renderFile(path.join(templatesFolder, 'example.jade'), { 
          siteNav: 'examples',
          nav: examplesNav,
          selectedNavItem: 'Introduction',
        });

        return fs.writeFileAsync(path.join(outputFolder, 'index.html'), 
            pageHtml, { encoding: 'utf-8' });         
      })
        .then(function renderEachExample() {
          return Promise.all(
            _.map(examples, function(example) {

              var pageHtml = jade.renderFile(path.join(templatesFolder, 'example.jade'), { 
                siteNav: 'examples',
                nav: examplesNav,
                selectedNavItem: example.title,
                readmeHtml: example.readme,
                files: example.files
              });

              return fs.writeFileAsync(path.join(outputFolder, example.slug + '.html'), 
                  pageHtml, { encoding: 'utf-8' }); 
            })
          );
        });
    })
  ;
};



/**
 * Walk given folder and its subfolders, returning all files
 * @param  {String} folder [description]
 * @return {Promise} Resolves to 
 */
var _walk = function(folder) {
  var defer = Promise.defer();

  var files = [];

  var walker = walk(folder, {
    followSymlinks: false
  });

  walker.on('file', function(file, stat) {
    files.push(file);
  });  

  walker.on('end', function() {
    defer.resolve(files);
  });  

  walker.on('error', function(err) {
    defer.reject(err);
  });  

  return defer.promise;
};







