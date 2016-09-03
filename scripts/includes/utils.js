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

      return new Q((resolve, reject) => {
        fs.readFile(file, (err, data) => {
          if (err) { 
            return reject(err);
          }
          
          resolve(data.toString());
        });
      });
    },
    writeFile: function(file, contents) {
      this.logCmd(`writeFile: ${file}`);

      return new Q((resolve, reject) => {
        fs.writeFile(file, contents, (err) => {
          if (err) { 
            return reject(err);
          }
          
          resolve();
        });
      });
    },
    walkFolder: function(rootFolder, regex, cb) {
      let promises = [];
      
      return new Q(function(resolve, reject) {
        let walker = walk(rootFolder, {
          followSymlinks: false
        });

        walker.on('file', function(file, stat) {
          var dirname = path.dirname(file),
            filename = path.join(path.relative(rootFolder, dirname), path.basename(file));

          if (!filename.match(regex)) {
            return;
          }

          promises.push(Q.coroutine(cb)(file));
        });

        walker.on('end', function() {
          resolve();
        });
      })
      .then(() => Q.all(promises));
    },
  };
}


