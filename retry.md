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
