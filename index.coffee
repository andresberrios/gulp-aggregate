
es = require 'event-stream'
_ = require 'lodash'

isFunction = (f) ->
  {}.toString.call(f) is '[object Function]'

module.exports = (opts, callback) ->
  if isFunction opts
    callback = opts
    opts = {}
  unless isFunction callback
    throw new Error "Invalid callback provided: #{callback}"

  opts.debounce ?= 200

  debouncedCallback = null
  if opts.debounce is 0
    debouncedCallback = -> callback generateAggregatedStream()
  else
    debouncedCallback = _.debounce ->
      callback generateAggregatedStream()
    , opts.debounce

  bufferOrder = []
  buffer = {}

  generateAggregatedStream = ->
    thisBufferOrder = _.clone bufferOrder
    thisBuffer = _.clone buffer
    nextReadIndex = 0
    return es.readable (count, endRead) ->
      while count > 0
        if nextReadIndex >= thisBufferOrder.length
          @emit 'end'
          break
        @emit 'data', thisBuffer[thisBufferOrder[nextReadIndex]]
        nextReadIndex++
        count--
      endRead()

  return es.map (file, sendThrough) ->
    unless buffer[file.path]?
      bufferOrder.push file.path
    buffer[file.path] = file

    debouncedCallback()

    sendThrough null, file