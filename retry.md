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
