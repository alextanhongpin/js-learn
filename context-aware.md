```js
// Time filter: Only takes data that are within the time slice of interest.
function timeFilter(config, next) {
  function isWithin(timeval) {
    return true // If within time value
  }
  return function(data) {
    if (isWithin(data.time)) {
      next(data)
    }
  }
}

// Accumulator: Two bucket types, tumbling and running.
// tumbling: After forwarding the data, empties the entire bucket and starts fresh.
// running: After forwarding data, only discards the oldest data element in the bucket.
function accumulate(config, next) {
  var bucket = []
  return function(data) {
    bucket.unshift(data)
    if (bucket.length >= config.size) {
      var newSize = (config.type === 'tumbling' ? 0 : bucket.length - 1)
      next(bucket.slice(0))
      bucket.length = newSize
    }
  }
}

// Clustering module
```
