## Counter and Rate Limit

The first code is a `Counter` (or Throttle?) to keep track of the user's request counter per day/week/month/year? This is sometimes coined the `Global Rate Limit`, since it imposes another layer of constraint on top of the existing rate limit. Say if you have a rate limit of 1 req/second, they you can make 86,400 requests per day. If we set a daily limit of 10,000 requests, then user will be constrained by the quota.


Counter can be chained (first check per year quota, then per month, then per day etc).
```js
const required = (key, value) => {
  if (value === null || value === undefined) {
    throw new Error(`"${key}" is required`)
  }
}

const time = Object.freeze({
  Millisecond: 1,
  Second: 1000,
  Minute: 1000 * 60,
  Hour: 1000 * 60 * 60,
  Day: 1000 * 60 * 60 * 24
})


class Throttle {
  buckets = {}
  constructor({
    threshold,
    durationInMs
  }) {
    required('threshold', threshold)
    required('durationInMs', durationInMs)
    this.threshold = threshold
    this.durationInMs = durationInMs
  }
  _getOrDefault(key) {
    return this.buckets[key] || 0
  }
  _increment(key) {
    const value = this.buckets[key] || 0
    // Apply a threshold multiplier so that the counter does not exceed the limit.
    if (value >= this.threshold * 10) return
    this.buckets[key] = value + 1
  }
  allow() {
    const now = Date.now()
    const curr = now - (now % this.durationInMs)
    const prev = curr - this.durationInMs
    for (let timeWindow in this.buckets) {
      if (parseInt(timeWindow, 10) <= prev) {
        const {
          [timeWindow]: _, ...rest
        } = this.buckets
        this.buckets = rest
      }
    }
    const count = this._getOrDefault(curr)
    this._increment(curr)
    return count < this.threshold
  }
}
```

Multiple throttle can be combined, and managed by a `ThrottleManager`. 
```js
class ThrottleManager {
  constructor(...throttles) {
    this.throttles = throttles
  }
  allow() {
    return this.throttles.map((fn) => fn.allow()).every(Boolean)
  }
}
const throttleManager = new ThrottleManager(
  // Rate of 1 request per second.
  new Throttle({
    threshold: 1,
    durationInMs: 1 * time.Second
  }), 
  // Limited to only 5 requests per day.
  new Throttle({
    threshold: 5,
    durationInMs: 1 * time.Day
  })
)
console.log(throttleManager.allow())
console.log(throttleManager.allow())
console.log(throttleManager.allow())
setTimeout(() => {
  console.log(throttleManager.allow())
  console.log(throttleManager.allow())
  console.log(throttleManager.allow())
  console.log(throttleManager.allow())
  console.log(throttleManager.allow())
  console.log(throttleManager.allow())
  setTimeout(() => {
    console.log(throttleManager.allow(), throttleManager)
  }, 2000)
}, 2000)
```

## Rate limiter 

Example with Sliding window algorithm. Note, this is simplified as it only handles per second measurement, per minute etc might behave differently. Also, this implementation does not keep track on the user's identity. Rate limiter cannot be chained/composed, since for greater range, the requests per second will always be lower than the rate limiter with the lower range.

```js
const required = (key, value) => {
  if (value === null || value === undefined) {
    throw new Error(`"${key}" is required`)
  }
}

const time = Object.freeze({
  Millisecond: 1,
  Second: 1000,
  Minute: 1000 * 60,
  Hour: 1000 * 60 * 60,
  Day: 1000 * 60 * 60 * 24
})

class RateLimiter {
  buckets = {}
  constructor({
    threshold,
    durationInMs
  } = {}) {
    required('threshold', threshold)
    required('durationInMs', durationInMs)
    this.requestsPerSecond = threshold / (durationInMs / time.Second)
    this.interval = setInterval(() => {
      console.log('starting rate limiter')
      this.clear()
    }, 2 * durationInMs)
  }

  stop() {
    console.log('stopping rate limiter')
    clearInterval(this.interval)
  }

  _incrementBucket(key) {
    if (!this.buckets[key]) {
      this.buckets[key] = 0
    }
    this.buckets[key] += 1
  }
  _getOrDefault(key) {
    return this.buckets[key] || 0
  }

  allow() {
    const now = Date.now()
    const elapsed = now % time.Second
    const curr = now - (elapsed)
    const prev = curr - time.Second
    for (const timeWindow in this.buckets) {
      if (parseInt(timeWindow, 10) < prev) {
        // delete this.buckets[timeWindow]
        const {
          [timeWindow]: _, ...rest
        } = this.buckets
        this.buckets = rest
      }
    }
    const limit = (this._getOrDefault(prev) * (1 - (elapsed / time.Second))) + this._getOrDefault(curr)
    // Don't include the current request in the limit.
    this._incrementBucket(curr)
    return limit < this.requestsPerSecond
  }
  clear() {
    const curr = now - (now % time.Second)
    const prev = curr - time.Second
    for (const timeWindow in this.buckets) {
      if (parseInt(timeWindow, 10) < prev) {
        const {
          [timeWindow]: _, ...rest
        } = this.buckets
        this.buckets = rest
      }
    }
  }
}

const rateLimiter = new RateLimiter({
  threshold: 1,
  durationInMs: 10 * time.Second
})

setInterval(() => {
  if (Math.random() < 0.5) {
    console.log(rateLimiter.allow(), rateLimiter)
  } else {
    console.log(rateLimiter)
  }
}, 1000)

rateLimiter.stop()
```
