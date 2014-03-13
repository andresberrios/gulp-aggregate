gulp-aggregate
==============

Gulp plugin that acts like a buffer, but a bit differently:

Every time the stream receives a file, it will keep it in an
in-memory buffer along with the files received in the past.
It then writes the full batch of files into a new stream and
emit `end` on that stream.

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
.pipe(aggregate(function(fileStreamWithEndEvent) {
    return fileStreamWithEndEvent
    .pipe(concat('concatenated.js'))
    .pipe(gulp.dest('public/scripts'));
}))
```