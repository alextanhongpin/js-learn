## Counter and Rate Limit

The first code is a `Counter` (or Throttle?) to keep track of the user's request counter per day/week/month/year? This is sometimes coined the `Global Rate Limit`, since it imposes another layer of constraint on top of the existing rate limit. Say if you have a rate limit of 1 req/second, they you can make 86,400 requests per day. If we set a daily limit of 10,000 requests, then user will be constrained by the quota.


Counter can be chained (first check per year quota, then per month, then per day etc).
```js
const time = Object.freeze({
  Millisecond: 1,
  Second: 1000,
  Minute: 1000 * 60,
  Hour: 1000 * 60 * 60,
  Day: 1000 * 60 * 60 * 24
})

const range = Object.freeze({
  Hourly: 'HOURLY',
  Daily: 'DAILY',
  Weekly: 'WEEKLY',
  Monthly: 'MONTHLY'
})

class Counter {
  buckets = {}
  constructor(threshold = 10000, range) {
    this.threshold = threshold
    this.range = range
  }
  getOrSetBucket(key) {
    if (!this.buckets[key]) {
      this.buckets[key] = 0
    }
    this.buckets[key]++
  }
  increment() {
    this.getOrSetBucket(this.getKey())
  }
  allow() {
    // Loop all the previous buckets and delete them.
    for (const key of this.buckets) {
      if (parseInt(key, 10) < this.getKey()) {
        delete(this.buckets, key)
      }
    }
    if (!Object.keys(this.buckets).length) {
      return true
    }
    return this.buckets[this.getKey()] < this.threshold
  }
  getKey() {
    const now = new Date()
    const [year, month, date, day, hour, minute] = [now.getFullYear(), now.getMonth(), now.getDate(), new Date().getDay(), now.getHours(), now.getMinutes()]
    switch (this.range) {
      case range.Hourly:
        return new Date(year, month, date, hour).getTime()
      case range.Daily:
        return new Date(year, month, date).getTime()
      case range.Weekly:
        // NOTE: Get the first day of the week as the key.
        return new Date(year, month, date - day).getTime()
      case range.Monthly:
        // NOTE: Need to find the start and the end of the month. 
        // Get the first date of the month as the key.
        return new Date(year, month, 1).getTime()
    }
  }
}

const counter = new Counter(3, range.Daily)
console.log(counter.allow())
counter.increment()
console.log(counter.allow())
counter.increment()
counter.increment()
counter.increment()
counter.increment()
console.log(counter.allow())
console.log(counter)
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
