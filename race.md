## Promise.race

Mimicking golang's context cancellation with promises.

```js
class TimeoutError extends Error {
  constructor(props) {
    super(props)
    this.name = 'TimeoutError'
  }
}

function timeout(durationInMs = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return reject(new TimeoutError(`timeout after ${durationInMs}ms`))
    }, durationInMs)
  })
}

function doWork(durationInMs = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve(true)
    }, durationInMs)
  })
}
async function main() {
  try {
    const result = await Promise.race([timeout(500), doWork(1000)])
    console.log('got result', result)
  } catch (error) {
    console.log(error)
    console.log([error.name, error.message].join(': '))
  }
}
main().catch(console.error)

// TimeoutError: timeout after 500ms
// TimeoutError: timeout after 500ms
```
