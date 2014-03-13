
gulp = require 'gulp'
gutil = require 'gulp-util'
es = require 'event-stream'
aggregate = require './index.js'

gulp.src 'files/*.js'
.pipe aggregate debounce: 10, (files) ->
  files.pipe es.mapSync (file) ->
    gutil.log gutil.colors.magenta file.path
.pipe es.mapSync (file) ->
  gutil.log file.path