## Safe counter

A safer way to implement counter without overflow:

```js
function Counter(threshold = 100) {
  let i = 0
  return function() {
    i = (i + 1) % threshold
    return i === 0
  }
}

const counter = Counter(100)
for (let i = 0; i < 2000; i += 1) {
  if (counter()) {
    console.log(true)
  }
}
```


## Login Counter 

Also called `jail gate` (?)

```js
const time = Object.freeze({
  Millisecond: 1,
  Second: 1000,
  Minute: 60 * 1000,
  Hour: 60 * 60 * 1000,
  Day: 24 * 60 * 60 * 1000
})


// This has a slightly different approach than rate limiter. For ratelimiter, every call to the requests will increment the counter, and if the rate exceededs the threshold for the given time window, user have to wait for the next time window. 
// For jail gate, the counter is only incremented whenever the user attempted a threat (login with wrong password etc), but the endpoint is checked for every requests if it can be called (user is not locked out yet).
const LoginThreat = Object.freeze({
  InvalidPassword: 'INVALID_PASSWORD',
  InvalidUser: 'INVALID_USER',
  RetryExceeded: 'RETRY_EXCEEDED'
})

class LoginCounter {
  // For testing only, set a higher limit, e.g. 30 * time.Minute for production.
  lockoutDuration = 1 * time.Second
  nextAllowedTime = null
  attempts = {}
  threshold = 3
  allow() {
    if (!this.nextAllowedTime || Date.now() < this.nextAllowedTime) {
      return false
    }

    // Clear old records.
    this.attempts = {}
    return true

  }

  _incrementOrSetDefault(type) {
    if (!this.attempts[type]) {
      this.attempts[type] = 0
    }
    this.attempts[type] += 1
  }

  increment(type) {
    this._incrementOrSetDefault(type)
    const attempts = Object.values(this.attempts).reduce((acc, i) => acc + i, 0)
    if (attempts > this.threshold) {
      this._incrementOrSetDefault(LoginThreat.RetryExceeded)
      this.nextAllowedTime = Date.now() + this.lockoutDuration
    }
  }
}

const counter = new LoginCounter()
counter.increment(LoginThreat.InvalidPassword)
counter.increment(LoginThreat.InvalidUser)
counter.increment(LoginThreat.InvalidUser)
counter.increment(LoginThreat.InvalidUser)

console.log(counter.allow())
console.log(counter)
setTimeout(() => {
  console.log(counter.allow())
  console.log(counter)
}, 2 * time.Second)
```


## Python counter implementation

```js
class Counter {
  constructor(data) {
    this.result = {}
    for (const item of data) {
      if (!this.result[item]) this.result[item] = 0
      this.result[item] += 1
    }
  }
  most_common(n = 5) {
      const values = Object.entries(this.result)
      return values.sort(([k1, v1], [k2, v2]) => {
        return v2 - v1
      }).slice(0, Math.min(n, values.length))
    }
    *[Symbol.iterator]() {
      const values = Object.entries(this.result)
      for (const value of values) yield value
    }
}

const counter = new Counter([1, 2, 2, 2, 1, 1, 2, 3, 3, 1])
console.log(counter)
console.log(counter.most_common(5))

for (const item of counter) {
  console.log('iterating', item)
}
```
