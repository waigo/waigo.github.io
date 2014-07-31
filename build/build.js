var commander = require('commander'), 
  git = require('gift'),
  path = require('path'),
  Promise = require('bluebird'),
  shell = require('shelljs');


var generator = require('./lib/generator');


Promise.promisifyAll(git);



var program = require('commander');
program
  .option('-e, --noversion', 'Do not find current module version from NPM')
  .option('-n, --noclone', 'Do not re-clone repositories. Re-use existing folders')
  .option('-l, --limit <limit>', 'Limit build to a particular resource types (one of: images, styles, scripts, html)', 'all')
  .parse(process.argv);


var reposFolder = path.join(__dirname, '.repos'),
  frontendSrcFolder = path.join(__dirname, 'frontend', 'src'),
  frontendBuildFolder = path.join(__dirname, '..');

var waigoRepoUrl = 'https://github.com/waigo/waigo.git',
  waigoRepoFolder = path.join(reposFolder, 'waigo'),
  examplesRepoUrl = 'https://github.com/waigo/examples.git',
  examplesRepoFolder = path.join(reposFolder, 'examples');



var version = '0.0.0-unknown';


Promise.resolve()
  .then(function() {
    if (program.dryrun && program.noversion) return;
    var versionOutput = shell.exec('npm view --json waigo dist-tags.latest', {silent:true}).output;
    version = versionOutput.match(/[0-9]+\.[0-9]+\.[0-9]+/i)[0];
    console.log('Version: ' + version);        
  })
  .then(function() {
    if (program.noclone) return;
    return Promise.all([
      cloneRepo(waigoRepoUrl, waigoRepoFolder),
      cloneRepo(examplesRepoUrl, examplesRepoFolder),
    ]);
  })
  .then(function() {
    console.log('Rebuilding frontend...');
    return generator.rebuild({
      version: version,
      repoFolder: waigoRepoFolder,
      examplesFolder: examplesRepoFolder,
      srcFolder: frontendSrcFolder,
      buildFolder: frontendBuildFolder,
      limitTo: (program.limit && 'all' !== program.limit) ? program.limit : null
    });
  })
  .then(function() {
    console.log('All done!');
  })
  .catch(logError)


var logError = function(err) {
  console.log(err);
  console.log(err.stack);
};

var cloneRepo = function(url, folder) {
  console.log('Cloning ' + url + ' into ' + folder);
  shell.rm('-rf', folder);
  return git.cloneAsync(url, folder)
    .then(function() {
      var gitRepo = openRepo(folder);
      return gitRepo.checkout('master');
    });
}

var openRepo = function(folder) {
  var repo =  git(folder);
  Promise.promisifyAll(repo);
  return repo;
};

