// Generated by CoffeeScript 1.7.1
(function() {
  var es, isFunction, _;

  es = require('event-stream');

  _ = require('lodash');

  isFunction = function(f) {
    return {}.toString.call(f) === '[object Function]';
  };

  module.exports = function(opts, callback) {
    var buffer, bufferOrder, debouncedCallback, generateAggregatedStream;
    if (isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    if (!isFunction(callback)) {
      throw new Error("Invalid callback provided: " + callback);
    }
    if (opts.debounce == null) {
      opts.debounce = 200;
    }
    debouncedCallback = null;
    if (opts.debounce === 0) {
      debouncedCallback = function() {
        return callback(generateAggregatedStream());
      };
    } else {
      debouncedCallback = _.debounce(function() {
        return callback(generateAggregatedStream());
      }, opts.debounce);
    }
    bufferOrder = [];
    buffer = {};
    generateAggregatedStream = function() {
      var nextReadIndex, thisBuffer, thisBufferOrder;
      thisBufferOrder = _.clone(bufferOrder);
      thisBuffer = _.clone(buffer);
      nextReadIndex = 0;
      return es.readable(function(count, endRead) {
        while (count > 0) {
          if (nextReadIndex >= thisBufferOrder.length) {
            this.emit('end');
            break;
          }
          this.emit('data', thisBuffer[thisBufferOrder[nextReadIndex]]);
          nextReadIndex++;
          count--;
        }
        return endRead();
      });
    };
    return es.map(function(file, sendThrough) {
      if (buffer[file.path] == null) {
        bufferOrder.push(file.path);
      }
      buffer[file.path] = file;
      debouncedCallback();
      return sendThrough(null, file);
    });
  };

}).call(this);
