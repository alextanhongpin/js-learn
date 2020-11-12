## Simple backoff algorithm

This example demonstrates how to perform exponential backoff using JavaScript. There is a max retry for each failed requests, and the timeout will be increased for each attempts.

```js
const timeouts = Array(10).fill(0).map((_, i) => Math.pow(i, 2) * 10)
console.log(timeouts)

async function delay(duration = 1000) {
  return new Promise((resolve) =>
    setTimeout(resolve, duration)
  )
}

// A simple jitter function to avoid thundering herd where all failed requests retries at the same time.
function jitter(duration = 1000) {
  return duration / 2 + Math.round(Math.random() * duration)
}

async function backoff(attempts = 0) {
  // Ensure that the timeout does not overflow.
  const duration = jitter(timeouts[attempts % timeouts.length])
  console.log('sleeping for', duration, 'seconds')
  await delay(duration)
}

async function backoffTask(asyncFunc, {
  maxRetry
} = {
  maxRetry: 10
}) {
  for (let i = 0; i < maxRetry; i++) {
    try {
      await backoff(i)
      // Return awaited function.
      return await asyncFunc()
    } catch (error) {
      // console.log(error)
    }
  }
  // When all the retries failed.
  throw new Error('too many failed attempts')
}

async function main() {
  try {
    console.log('running first task')
    await backoffTask(async function failedTask() {
      throw new Error('bad request')
    })
  } catch (error) {
    console.log(error)
  }
  console.log('running second task')
  await backoffTask(async function successfullTask() {
    return 'hello world'
  })
}

main().catch(console.error)
```
