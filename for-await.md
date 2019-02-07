## for await...of

```js
async function asyncTask(duration = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('completed')
      resolve(1)
    }, duration)
  })
}

async function main() {
  console.time()
  const tasks = Array(100).fill(() => asyncTask(1000)).map(fn => fn())
  for await (let task of tasks) {
    console.log(task)
  }
  console.timeEnd()
}

main().catch(console.error)
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
