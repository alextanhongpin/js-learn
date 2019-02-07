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
    console.log(await result)
  }
}

main().catch(console.error)
```
