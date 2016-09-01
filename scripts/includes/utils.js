"use strict";

const fs = require('fs'),
  path = require('path'),
  walk = require('findit'),
  shell = require('shelljs'),
  Q = require('bluebird');


exports.create = function (options) {
  options = options || {};
  
  return {
    logCmd: function(str) {
      if (options.verbose) {
        console.log(`\n\t[SHELL]: ${str}`);
      }
    },
    logAction: function(str) {
      if (options.verbose) {
        console.log(`\n>> ${str}`);
      }      
    },
    logError: function(err) {
      console.error(err);
    },
    exec: function(cmd) {
      this.logCmd(cmd);

      let ret = shell.exec(cmd);

      if (0 !== ret.code) {
        throw new Error(`Error executing: ${cmd}`, ret.stderr);
      }

      return ret.stdout;
    },
    readFile: function(file) {
      this.logCmd(`readFile: ${file}`);

      return fs.readFileSync(file, {encoding:"utf-8"}).toString();      
    },
    writeFile: function(file, contents) {
      this.logCmd(`writeFile: ${file}`);

      return fs.writeFileSync(file, contents, {encoding:'utf-8'});
    },
    walkFolder: function(rootFolder, regex, cb) {
      return new Q(function(resolve, reject) {
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
    },
  };
}


