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
class RateLimiter {
  buckets = {}
  constructor(requestsPerSecond = 1) {
    this.requestsPerSecond = requestsPerSecond
  }
  _increment(key) {
    if (!this.buckets[key]) this.buckets[key] = 0
    this.buckets[key]++
  }
  _getOrDefault(key) {
    return this.buckets[key] || 0
  }
  allow() {
    const now = Date.now()
    // From the previous time window.
    const elapsed = 1 - ((now % 1000) / 1000)
    // Take only the seconds
    const curr = Math.round(now / 1000)
    // The previous time window difference by 1 second.
    const prev = curr - 1
    // TODO: Clear previous ones.
    for (const key in this.buckets) {
      if (Number(key) < prev) {
        delete this.buckets[key]
      }
    }
    this._increment(curr)
    return (this._getOrDefault(prev) * elapsed + this._getOrDefault(curr)) < this.requestsPerSecond
  }
}

const rl = new RateLimiter(2)
console.log(
  rl.allow(),
  rl.allow(),
  rl
)
setTimeout(() => {
  console.log(
    rl,
    rl.allow(),
    rl,
    rl.allow(),
    rl
  )

  setTimeout(() => {
    console.log(
      rl,
      rl.allow(),
      rl,
      rl.allow(),
      rl
    )
  }, 1500)

}, 1500)
```
