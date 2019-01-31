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


## Throttling 

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
