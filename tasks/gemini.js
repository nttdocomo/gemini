/*
 * grunt-gemini
 * https://github.com/nttdocomo/gemini
 *
 * Copyright (c) 2015 nttdocomo
 * Licensed under the MIT license.
 */

'use strict';

var NodeGit = require("nodegit"),
open = NodeGit.Repository.open,
path = require("path"),
cssRevReplace = require('./lib/css-rev-replace');

module.exports = function(grunt) {
  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('gemini', 'A grunt gplugin got git revision', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options();

    /*open(repoPath).then(function(repo) {
      return repository.getCurrentBranch().then(function(reference){
        return repository.getReferenceCommit(reference)
      })
    }).then(function(commit){
      currentCommit = commit;
    })*/

    // Iterate over all specified file groups.
    //console.log(options);
    var workingDir = path.resolve(),repoPath = path.resolve(options.repo),
    me = this,
    done = this.async();
    open(repoPath).then(function(repo) {
      return repo.getCurrentBranch().then(function(reference){
        return repo.getReferenceCommit(reference)
      })
    }).then(function(commit){
      return me.files.reduce(function(sequence, f){
        console.log(f.src)
        return sequence.then(function() {
          var src = f.src.filter(function(filepath) {
            // Warn on and remove invalid source files (if nonull was set).
            if (!grunt.file.exists(filepath)) {
              grunt.log.warn('Source file "' + filepath + '" not found.');
              return false;
            } else {
              return true;
            }
          }).map(function(filepath) {
            // Read file source.
            //console.log(grunt.file.read(filepath))
            return grunt.file.read(filepath);
          });
          src = src.filter(function(content){
            //console.log(/\burl\s*\(\s*["']?([^"'\r\n,]+?)["']?\s*\)/ig.test(content))
            return /\burl\s*\(\s*["']?([^"'\r\n,]+?)["']?\s*\)/ig.test(content)
          });
          return Promise.resolve().then(function(){
            return src.reduce(function(sequence, content){
              return sequence.then(function() {
                return cssRevReplace(content,f,workingDir,repoPath,commit,options)
              }).then(function(chapter) {
                // 并添加到页面
                //console.log('It\'s saved!')
              });
            }, Promise.resolve())
          })
        }).then(function() {
          // 并添加到页面
          //console.log('all content saved!')
        });
      },Promise.resolve());
    }).then(function(){
      //console.log('all files saved!')
      done(true)
    })
  });

};
