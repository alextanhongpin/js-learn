# Asynchronous handling for error

```js
function asyncTask() {
  return new Promise((resolve, reject) => {
    Math.random() < 0.5
      ? reject(new Error('invalid number'))
      : resolve(1)
  })
}


async function main() {
  const promises = Array(10).fill(asyncTask).map(async (task) => {
    try {
      const res = await task()
      return res
    } catch (error) {
      console.log('TaskError:', error.message)
      return null
    }
  })

  const result = await Promise.all(promises)
  const response = result.filter((nonNull) => nonNull)
  console.log(response)
  console.log(`${response.length} out of ${result.length} succeed`)
}

main().catch(console.error)
```


## With Promise.allSettled

```js
async function task(error = false) {
  if (error) throw new Error('bad request')
  return 'hello world'
}

async function main() {
  const tasks = await Promise.allSettled([task(true), task(false)])
  console.log(tasks)
  // Failed tasks will return { status: 'rejected', reason: Error}
  // Successful tasks will return { status: 'fulfilled', value: 'hello world' }
  const completedTasks = tasks.filter((result) => {
    switch (result.status) {
      case 'rejected':
        console.log(result.reason)
        return false
      case 'fulfilled':
        return true
      default:
        return false
    }
  }).map(({
    value
  }) => value)
  console.log(completedTasks) // ['hello world']
}

main()
```

## Implementing Promise.allSettled with Promise.all

```js
async function task(error = false) {
  if (error) throw new Error('bad request')
  return 'hello world'
}

async function errorWrapper(asyncFunc, ...params) {
  try {
    const value = await asyncFunc(...params)
    return {
      status: 'fulfilled',
      value
    }
  } catch (error) {
    return {
      status: 'rejected',
      reason: error
    }
  }
}

async function main() {
  const tasks = await Promise.all([errorWrapper(task, true), errorWrapper(task, false)])
  const completedTasks = tasks.flatMap((result) => result.status === 'fulfilled' ? [result.value] : [])
  console.log(completedTasks) // ['hello world']
}

main()
```

## If we only care about the values

```js
async function task(error = false) {
  if (error) throw new Error('bad request')
  return 'hello world'
}

async function errorWrapper(asyncFunc, ...params) {
  try {
    const value = await asyncFunc(...params)
    return [value]
  } catch (error) {
    return []
  }
}

async function main() {
  const tasks = await Promise.all([errorWrapper(task, true), errorWrapper(task, false)])
  const completedTasks = tasks.flatMap(item => item)
  console.log(completedTasks) // ['hello world']
}

main()
```
