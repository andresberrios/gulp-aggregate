gulp-aggregate
==============

Gulp plugin that acts like a buffer, but a bit differently:

gulp-aggregate is a Through stream with a twist.
Every time the stream receives a file, it will keep it in an
in-memory buffer along with the files received in the past,
keeping one copy per file path.
It then writes the full batch of files into a new stream
(which is passed to a callback function) and emits the `end`
event on that stream.

This behaviour allows you to use continuous streams (that never
emit the `end` event) and make them play well with other gulp
plugins that expect the source stream to end.

Example:

```javascript
watch = require('gulp-watch');
aggregate = require('gulp-aggregate');

// concat requires 'end' event in order to concat all the files
concat = require('gulp-concat');

fileStreamWithNoEndEvent = watch({glob: 'watchedScripts/*.js'})
.pipe(aggregate({debounce: 10}, function(fileStreamWithEndEvent) {
    return fileStreamWithEndEvent
    .pipe(concat('concatenated.js'))
    .pipe(gulp.dest('public/scripts'));
}))
```

The default `debounce` time is 50ms. After `debounce` milliseconds without
receiving data, the `callback` function will get called with the new aggregated stream.
