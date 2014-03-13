// Generated by CoffeeScript 1.7.1
(function() {
  var aggregate, es, gulp, gutil;

  gulp = require('gulp');

  gutil = require('gulp-util');

  es = require('event-stream');

  aggregate = require('./index.js');

  gulp.src('files/*.js').pipe(aggregate({
    debounce: 10
  }, function(files) {
    return files.pipe(es.mapSync(function(file) {
      return gutil.log(gutil.colors.magenta(file.path));
    }));
  })).pipe(es.mapSync(function(file) {
    return gutil.log(file.path);
  }));

}).call(this);
