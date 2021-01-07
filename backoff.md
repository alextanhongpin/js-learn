## Simple backoff algorithm

This example demonstrates how to perform exponential backoff using JavaScript. There is a max retry for each failed requests, and the timeout will be increased for each attempts.

```js
const timeouts = Array(10).fill(0).map((_, i) => Math.pow(i, 2) * 10)
console.log(timeouts)

async function delay(duration = 1000) {
  return new Promise((resolve) =>
    setTimeout(resolve, duration)
  )
}

// A simple jitter function to avoid thundering herd where all failed requests retries at the same time.
function jitter(duration = 1000) {
  return duration / 2 + Math.round(Math.random() * duration)
}

async function backoff(attempts = 0) {
  // Ensure that the timeout does not overflow.
  const duration = jitter(timeouts[attempts % timeouts.length])
  console.log('sleeping for', duration, 'seconds')
  await delay(duration)
}

async function backoffTask(asyncFunc, {
  maxRetry
} = {
  maxRetry: 10
}) {
  for (let i = 0; i < maxRetry; i++) {
    try {
      await backoff(i)
      // Return awaited function.
      return await asyncFunc()
    } catch (error) {
      // console.log(error)
    }
  }
  // When all the retries failed.
  throw new Error('too many failed attempts')
}

async function main() {
  try {
    console.log('running first task')
    await backoffTask(async function failedTask() {
      throw new Error('bad request')
    })
  } catch (error) {
    console.log(error)
  }
  console.log('running second task')
  await backoffTask(async function successfullTask() {
    return 'hello world'
  })
}

main().catch(console.error)
```

## Throttling jobs


Running background job with two different mode:
1. Backoff: This checks for error, if there are errors, we repeatedly increment the attempts, and sleep for a longer time. When the operation no longer produces error, the attempts is reset, and the job runs at constant time.
2. Snapshot: Inspired by Redis's snapshot, we check the number of items to be processed. If it reaches the threshold at every given period, execute it. Else, skip the job.


```js
class Backoff {
  // The next duration is just computed by taking the current + current/2, and rounding them up.
  durations = [0, 3, 6, 9, 15, 25, 40, 65, 100] // In seconds.
  attempts = 0

  increment() {
    this.attempts++
  }

  reset() {
    this.attempts = 0
  }

  get duration() {
    const attempts = Math.min(this.attempts, this.durations.length - 1)
    return this.durations[attempts] * 1000
  }

  get jitter() {
    return this.duration + Math.round(Math.random() * this.duration / 2)
  }
}

class BackoffInterval {
  constructor() {
    this.backoff = new Backoff()
    this.interval = -1
    this.nextRun = null
  }

  run(asyncFn, duration = 1000) {
    this.nextRun = this.nextRun ?? Date.now()
    this.stop()
    this.interval = setInterval(async () => {
      if (Date.now() > this.nextRun) {
        const ok = await asyncFn()
        ok ? this.backoff.reset() : this.backoff.increment()
        this.nextRun = Date.now() + this.backoff.jitter
      }
    }, duration)
  }
  stop() {
    clearInterval(this.interval)
    this.interval = -1
  }
}

const backoff = new BackoffInterval()
let ok = false
backoff.run(async () => {
  console.log('do backoff interval')
  return ok
})

setTimeout(() => {
  ok = true
}, 8000)
```

```js
class Snapshot {
  conditions = [{
      seconds: 1,
      threshold: 100
    },
    {
      seconds: 3,
      threshold: 50
    },
    {
      seconds: 5,
      threshold: 25
    },
    {
      seconds: 10,
      threshold: 5
    },
    {
      seconds: 30,
      threshold: 1
    }
  ]

  allow(value) {
    const now = Math.floor(Date.now() / 1000)
    return this.conditions.some(({
      seconds,
      threshold
    }) => now % seconds === 0 && value >= threshold)
  }
}


class SnapshotInterval {
  constructor() {
    this.snapshot = new Snapshot()
    this.interval = -1
    this.threshold = 0
  }
  run(asyncFn, duration = 1000) {
    this.stop()
    this.interval = setInterval(async () => {
      if (this.snapshot.allow(this.threshold)) {
        try {
          await asyncFn()
          this.threshold = 0
        } catch (error) {
          console.error(error)
        }
      }
    }, duration)
  }
  stop() {
    clearInterval(this.interval)
    this.interval = -1
  }
}


const snapshot = new SnapshotInterval()
snapshot.threshold = 100

snapshot.run(async () => {
  console.log('do snapshot interval')
})
setTimeout(() => {
  snapshot.threshold = 10
}, 5000)
```
