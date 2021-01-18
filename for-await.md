# for-await


When batching tasks, always put an async `setImmediate` in between:
https://github.com/alextanhongpin/js-learn/blob/master/set-immediate.md


## for await...of

There's not much difference using `for await...of` and `Promise.all`. In fact, they are interchangable:
```js
async function sleep(duration = 1000) {
  console.log('starting')
  return new Promise((resolve) => setTimeout(resolve, duration, duration))
}

async function* batch(tasks, n = 5) {
  let i = 0
  while (i * n < tasks.length) {
    const todos = tasks.slice(i * n, (i + 1) * n)
    const result = await Promise.all(todos.map(fn => fn()))
    yield* result
    i++
  }
}

async function concurrentForAwait() {
  console.log('testing concurrentForAwait')
  console.time()
  const tasks = [sleep(), sleep(2000), sleep()] // Start all the tasks.

  // Since we are looping, we will not know which task completes first. If the first item in the loop takes a long time, then it will slow down the rest.
  for await (let result of tasks) {
    // Saves a step if you want work on the individual results separately, compared to Promise.all.
    console.log(result)
  }
  console.timeEnd()
}

async function concurrentPromiseAll() {
  console.log('testing concurrentPromiseAll')
  console.time()
  const results = await Promise.all([sleep(), sleep(2000), sleep()]) // Start all the tasks.
  console.timeEnd()
}

async function concurrentBatch() {
  console.log('testing concurrentBatch')
  console.time()
  const tasks = Array(11).fill(() => sleep())
  for await (let result of batch(tasks)) {
    console.log(result)
  }
  console.timeEnd()
}

async function main() {
  await concurrentForAwait()
  await concurrentPromiseAll()
  await concurrentBatch()
}
```


## Throttling with for ... await

```js
function asyncTask(duration = 1000) {
  return new Promise(resolve => {
    setTimeout(resolve, duration, duration)
  })
}

async function main() {
  const items = Array(10).fill(() => asyncTask()) {
    const generator = batchThrottle(3, ...items)
    console.log(await generator.next())
    for await (let result of generator) {
      console.log(result)
    }
  }

  {
    const generator = streamThrottle(3, ...items)
    for await (let result of generator) {
      console.log(result)
    }
  }

}

async function* batchThrottle(n = 5, ...items) {
  while (items.length) {
    const tasks = items.splice(0, n).map(fn => fn())
    console.log('doing tasks', tasks.length, tasks)
    let result = []
    for await (let task of tasks) {
      result.push(task)
    }
    yield result
  }
}

async function* streamThrottle(n = 5, ...items) {
  while (items.length) {
    const tasks = items.splice(0, n).map(fn => fn())
    console.log('doing tasks', tasks.length, tasks)
    let result = []
    for await (let task of tasks) {
      result.push(task)
    }
    yield* result
  }
}
main().catch()
```

## Throttling with Promise.all

```js
function asyncTask(duration = 1000) {
  return new Promise(resolve => {
    setTimeout(resolve, duration, duration)
  })
}


async function main() {
  const items = Array(10).fill(() => asyncTask()) {
    const generator = batchThrottlePromises(3, ...items)
    console.log(await generator.next())
    for await (let result of generator) {
      console.log(result)
    }
  }

  {
    const generator = streamThrottlePromises(3, ...items)
    for await (let result of generator) {
      console.log(result)
    }
  }

}

async function* batchThrottlePromises(n = 5, ...items) {
  while (items.length) {
    const tasks = items.splice(0, n).map(fn => fn())
    console.log('doing tasks', tasks.length, tasks)
    yield Promise.all(tasks)
  }
}

async function* streamThrottlePromises(n = 5, ...items) {
  while (items.length) {
    const tasks = items.splice(0, n).map(fn => fn())
    console.log('doing tasks', tasks.length, tasks)
    yield* await Promise.all(tasks)
  }
}
main().catch()
```


## Promise Pool

```js
function PromisePool (limit = 5) {
  return async function * generator (...tasks) {
    while (tasks.length) {
      const todos = tasks.splice(0, limit).map(fn => fn())
      yield * await Promise.all(todos)
    }
  }
}

function delay (duration = Math.random() * 1000) {
  return new Promise(resolve => {
    setTimeout(resolve, duration, duration)
  })
}

async function asyncTask (duration) {
  return delay(duration)
}

async function main () {
  const pool = PromisePool(5)
  const tasks = Array(100)
    .fill(0)
    .map(_ => Math.random() * 250 + 250)
    .map((duration) => () => asyncTask(duration))
  const generator = await pool(...tasks)
  for await (let result of generator) {
    console.log(result)
  }
}

main().catch(console.error)
```

## Rate-limit and Timeout

NOTE: Old version, see version below.

`Promise.all` will wait for all the promises to complete. Hence, we can introduce a rate-limit by inserting an async timeout that will take a given duration, say 1 second. Hence, the `Promise.all` will only complete after 1 seconds (or more if other functions took longer than 1s). To prevent the function from stalling, we can introduce a timeout mechanism with `Promise.race`. We will race the other promises (with the ratelimit function) with another delay timeout. The fastest one will resolve first. The implementation is demonstrated below. Here we return an array of two arguments (similar like `golang`), whereby the first item is the response, and the second is an `error` object. The `Promise.all` should not fail, since if there is an error thrown in the function, the whole operation will fail.

```js
const SECOND = 1000

function PromisePool (limit = 5, min = 1 * SECOND, max = 3 * SECOND) {
  return async function * generator (...tasks) {
    while (tasks.length) {
      const todos = tasks
        .splice(0, limit)
        .map(fn => fn())
        .concat([
          delay(min, [null, new Error('rate-limit')])
        ])
      const promises = Promise.all(todos)
      const conditions = Promise.all([
        delay(max, [null, new Error('timeout')])
      ])
      const result = await Promise.race([promises, conditions])
      yield * result
    }
  }
}

function delay (duration = Math.random() * 1000, output = true) {
  return new Promise(resolve => {
    setTimeout(resolve, duration, output)
  })
}

async function randomError (duration) {
  await delay(duration)
  if (Math.random() < 0.25) {
    throw new Error('WorkError')
  }
  return Math.random()
}

async function asyncTask (duration) {
  try {
    const result = await randomError(duration)
    return [result, null]
  } catch (error) {
    return [null, error]
  }
}

async function main () {
  const pool = PromisePool(5, 0.25 * SECOND, 0.5 * SECOND)
  const tasks = Array(100)
    .fill(0)
    .map(_ => Math.random() * 250 + 250)
    .map((duration) => () => asyncTask(duration))
  const generator = await pool(...tasks)
  let counter = 0
  let errors = 0
  for await (const [res, err] of generator) {
    if (err) {
      // Handle error
      if (err.message !== 'rate-limit' && err.message !== 'timeout') {
        errors++
      }
      console.log(err)
      continue
    }
    if (res) {
      // Got result, else timeout if both is empty.
      console.log('result', res)
      counter++
    } else {
      // Timeout.
    }
  }
  console.log(`processed ${counter} out of ${tasks.length} with ${errors} errors`)
}

main().catch(console.error)
```


## With Retry
Old version, see version below.
```js
// batching Promises.all

const SECOND = 1000
function PromisePool (maxConcurrency = 5, minWaitTime = SECOND, timeoutInSeconds = 5 * SECOND) {
  return async function * (...asyncTasks) {
    while (asyncTasks.length) {
      const tasks = asyncTasks.splice(0, maxConcurrency).map(fn => fn()).concat([
        delay(minWaitTime, [, 'waited'])
      ])
      const timeout = [delay(timeoutInSeconds, [, 'timeout'])]
      yield * await Promise.race([
        Promise.all(tasks), Promise.all(timeout)
      ])
    }
  }
}

async function delay (durationInSeconds = SECOND, result = true) {
  return new Promise(resolve => setTimeout(resolve, durationInSeconds, result))
}

async function delayOrError () {
  if (Math.random() < 0.4) throw new Error('invalid task')
  const duration = Math.random() * 1000 + 500
  return delay(duration, duration)
}

async function mockAsyncTask () {
  try {
    const result = await delayOrError()
    return [result ]
  } catch (error) {
    return [, error]
  }
}

async function main () {
  const retry = Retry(10)
  const asyncTasks = Array(100)
    .fill(() => retry(mockAsyncTask))

  const pool = PromisePool(5, 2 * SECOND, 10 * SECOND)
  let counter = 0
  for await (const [result, error] of pool(...asyncTasks)) {
    if (error) {
      if (error instanceof Error) {
        console.log(error.message)
      } else {
        switch (error) {
          case 'timeout':
            console.log('isTimeout')
            break
          case 'waited':
            console.log('waited')
            break
        }
      }
      continue
    }
    counter++
    console.log(result)
  }
  console.log(`${counter} of ${asyncTasks.length} completed`)
}

function Jitter (min = 500, max = 10000) {
  return function (i) {
    return Math.round(Math.random() * max + min)
  }
}

function Retry (threshold = 3, algorithm = Jitter(500, 1000)) {
  return async function (fn, ...args) {
    let i = 0
    while (i < threshold) {
      const [result, err] = await fn.apply(this, args)
      if (err) {
        i++
        const duration = algorithm(i)
        console.log(`retrying in ${duration} milliseconds, retry=${i}`)
        await delay(duration)
        continue
      }
      console.log('got result', result)
      return [result]
    }
    return [, new Error('RetryError')]
  }
}

main().catch(console.error)
```


## Implementing Retry Clean Code

```js
class RetryError extends Error {
  constructor(message) {
    super(message)
    this.name = 'RetryError'
  }
}

async function sleep(duration = 1000) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

const strategies = {
  linear: i => i * 1000,
  exponential: i => Math.pow(2, i) * 1000,
  jitter: i => Math.round(strategies.exponential(i) / 2 * (1 + Math.random()))
}

async function* retry(n = 10, strategy = 'linear') {
  const algo = strategies[strategy] || strategies.jitter
  for (let i = 0; i <= n; i++) {
    const duration = algo(i)
    await sleep(duration)
    yield duration
  }
  throw new RetryError('too many retries')
}

async function withRetry(task, n=10) {
  for await (const duration of retry(n)) {
    try {
      const result = await task()
      return result
    } catch (error) {
      continue
    }
  }
}

async function main() {
  console.log('linear:', Array(10).fill(0).map((_, i) => strategies.linear(i)))
  console.log('exponential:', Array(10).fill(0).map((_, i) => strategies.exponential(i)))
  console.log('jitter:', Array(10).fill(0).map((_, i) => strategies.jitter(i)))

  for await (const duration of retry(3)) {
    console.log('slept', duration)
    if (Math.random() < 0.2) {
      console.log('performing task successfully')
      break
    }
    console.log('task failed')
  }
  console.log('done')
  
  await withRetry(() => {
    throw new Error('bad request')
  }, 3)
}

main().catch(console.error)
```

## With Timeout

```js
class TimeoutError extends Error {
  constructor(message) {
    super(message)
    this.name = 'TimeoutError'
  }
}

const timeout = async (duration) => {
  await sleep(duration)
  throw new TimeoutError('timeout')
}

async function withTimeout(task, duration = 1000) {
  const result = await Promise.race([task(), timeout(duration)])
  return result
}

async function main() {
  await withTimeout(() => sleep(250), 500)
  console.log('done')

  try {
    await withTimeout(sleep, 500)
  } catch (error) {
    console.log(error.name, error.message, error instanceof TimeoutError)
  }
}
main().catch(console.error)
```

## Combining batchPromise with retry and timeout

```js
async function asyncSetImmediate() {
  return new Promise(resolve => setImmediate(resolve))
}

async function* batchPromise(tasks, {
  batchSize = 5,
  retry = 10,
  timeout = 1000
}) {
  for (let i = 0; i < tasks.length; i += batchSize) {
    const todos = tasks.slice(i, i + batchSize)
    const pending = todos.map(fn => {
      if (timeout > 0 && retry > 0) {
        return withRetry(() => withTimeout(fn, timeout), retry)
      }
      if (timeout > 0) {
        return withTimeout(fn, timeout)
      }
      if (retry > 0) {
        return withRetry(fn, retry)
      }
      return fn()
    })

    yield* await Promise.allSettled(pending)

    // Allow context switching for other tasks.
    await asyncSetImmediate()
  }
}

async function main() {
  // Testing retries. 
  // const tasks = Array(11).fill(() => { throw new Error('bad request' )})

  // Testing timeouts. NOTE. It will retry due to timeout, so disable retry.
  // const tasks = Array(11).fill(() => sleep(2000))
  const tasks = Array(11).fill(() => {
    if (Math.random() < .3) {
      console.log('failed')
      throw new Error('bad request')
    }
    sleep(Math.random() < .5 ? 1000 : 2000)
    return true
  })
  const options = {
    batchSize: 10,
    timeout: 1500,
    retry: 3
  }
  const batched = batchPromise(tasks, options)
  for await (let result of batched) {
    console.log('result', result)
  }
  console.log('done')
}

main().catch(console.error)
```
