## Custom Errors

```js
class TimeoutError extends Error {
  constructor(props) {
    super(props)
    this.name = 'TimeoutError'
    this.message = 'timeout exceeded'
  }
}
async function main() {
  try {
    throw new TimeoutError()
  } catch (error) {
    console.log(error instanceof TimeoutError, error.name, error.message)
  }
}
main().then(console.log).catch(console.error)
```

## Alternative Error Handling
```js
async function asyncTask(work, ...args) {
  try {
    const response = await work.apply(this, args)
    return [response, null]
  } catch (error) {
    return [null, error]
  }
}

function delay(duration = 1000, response = true) {
  return new Promise(resolve => setTimeout(resolve, duration, response))
}
async function main() {
  const [res, err] = await asyncTask(delay, 1000)
  if (err) {
    console.log(err)
  }
  console.log(res)
}
main().catch(console.error)
```


## Flattening error handling

```js
async function task() {
  return [, new Error('something bad happened')]
}

async function main() {
  const req = {}
  const log = logger.child(req)
  const [result, err] = await task(req)
  if (err) {
    log.error(err)
    return
  }
  console.log(result)
}

async function main() {
  const req = {}
  const log = logger.child(req)
  try {
    const result = await anotherTask(req)
    console.log(result)
  } catch(error) {
    log.error(err)
  }
}
```
