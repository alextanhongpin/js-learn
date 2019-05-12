## Retry pattern

Part of resiliency pattern. Also take a look at `circuit-breaker`.

```js
const SECOND = 1000
function delay (duration) {
  return new Promise(resolve => setTimeout(resolve, duration, duration))
}

function Retry (threshold = 3, linear = (i) => i * SECOND) {
  return async function (fn, ...args) {
    for (let i = 0; i <= threshold; i += 1) {
      try {
        const result = await fn.apply(this, args)
        return result
      } catch (error) {
        if (i === threshold) {
          throw new Error(`RetryError: retried ${i} times, ${error}`)
        }
        console.log('retrying', i + 1, error.message)
        await delay(linear(i + 1))
      }
    }
  }
}

function Task (state = 0) {
  return async function () {
    state++
    if (state === 5) {
      return 1
    }
    throw new Error('TaskError: an error occured')
  }
}
async function main () {
  const task = new Task()
  const retry = Retry()
  const result = await retry(task)
  console.log(result)
}

main().catch(console.error)
```

## Another implementation

```js
const SECOND = 1000
function delay (durationInSeconds = SECOND, result = true) {
  return new Promise(resolve => setTimeout(resolve, durationInSeconds, result))
}

function Linear (durationInSeconds = SECOND) {
  return function (i) {
    return (i + 1) * durationInSeconds
  }
}

function Jitter (min = 500, max = 10000) {
  return function (i) {
    return Math.round(Math.random() * max + min)
  }
}

function exponential () {}

function Retry (threshold = 3, algorithm = Jitter(500, 1000)) {
  return async function (fn, ...args) {
    let i = 0
    while (i < threshold) {
      try {
        const result = await fn.apply(this, args)
        console.log('got result', result)
        return result
      } catch (error) {
        console.log(error)
        i++
        const duration = algorithm(i)
        console.log(`retrying in ${duration} milliseconds, retry=${i}`)
        await delay(duration)
      }
    }
    throw new Error('RetryError')
  }
}

function AsyncTask (i = 0, successWhen = 3) {
  return async function () {
    i += 1
    if (i <= successWhen) {
      throw new Error('TaskError: cannot be completed')
    }
    return { success: true }
  }
}

async function main () {
  const retry = Retry(2)
  // Does not need try catch, as it is already handled.
  try {
    const result = await retry(AsyncTask())
    console.log('got result!', result)
  } catch (error) {
    console.log('error retrying', error.message)
  }
}

main().catch(console.error)

// Flattening try cat
```

## Another implementation

```js
// PSEUDO CODE
// retries = 0
// DO
// 	wait (2^retries * 100 milliseconds)
//  status = do_request() or get_async_result()
// 	IF status = SUCCESS
//		retry = false
//  ELSE
//    	retry = true
// 		retries = retries + 1
// WHILE (retry AND (retries < MAX_RETRIES))
const time = {
    Millisecond: 1,
    Second: 1000,
    Minute: 1000 * 60,
    Hour: 1000 * 60 * 60,
    Day: 1000 * 60 * 60 * 24
}

const jitter = t => Math.round(t / 2 + Math.random() * t)
let BACKOFFS = [0, 1000, 4000, 9000, 16000, 25000, 36000, 49000, 64000, 81000]

const sleep = async (duration = 1 * time.Second) =>
    new Promise((resolve) => setTimeout(resolve, duration))

const Retry = async (fn, {
    maxRetry = 3,
    onError // Error hook
} = {}) => {
    let retry = 0
    while (retry < maxRetry) {
        await sleep(jitter(BACKOFFS[Math.min(retry, BACKOFFS.length)]))
        try {
            return await fn()
        } catch (error) {
            retry++
            onError && onError({
                error,
                retry
            })
        }
    }

    // TODO: Look into how to wrap errors.
    throw new Error(`RetryError: exiting after ${retry} retries`)
}

async function main() {
    try {
        const result = await Retry(function() {
            throw new Error('bad request')
        }, {
            maxRetry: 3,
            onError: ({
                retry,
                error
            }) => console.log(`error=${error.message} retry=${retry}`)
        })
        console.log(result)
    } catch (error) {
        console.log(error)
    }
}

main().catch(console.error)
```


## Clean Retry

```js
class BackoffPolicy {
  milliseconds = Object.freeze([0, 250, 500, 1000, 2500, 5000, 10000, 15000])
  duration(n) {
    if (n > this.milliseconds.length) {
      n = this.milliseconds.length - 1
    }
    console.log(this.milliseconds)
    return jitter(this.milliseconds[n])
  }
}

function jitter(duration) {
  return duration / 2 + (Math.random() * duration)
}

async function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(duration), duration)
  })
}

async function doWork() {
  throw new Error('bad request')
}

function createBackoff() {
  return Object.freeze(new BackoffPolicy())
}

async function main() {
  const defaultBackoff = createBackoff()
  // This will throw error.
  // defaultBackoff.milliseconds.push(1)
  for (let i = 0; i < 3; i += 1) {
    const sleep = await delay(defaultBackoff.duration(i))
    console.log(`sleep for ${sleep} milliseconds`)
    try {
      await doWork()
      break
    } catch (err) {
      console.log('error:', err.message)
      continue
    }
  }
}

main().catch(console.error)
```
