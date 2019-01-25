## Simple worker sending at different interval

Here we use `trampoline` to avoid stackoverflow:

```js
const SECOND = 1000
async function asyncTask(min = 1 * SECOND, max = 5 * SECOND) {
  const duration = Math.round(Math.random() * max + min)
  await delay(duration)
  console.log('doing work', duration)
  return asyncTask
}

function trampoline(fn) {
  return async function (...args) {
    let result = await fn(...args)
    while (typeof result === 'function') {
      result = await result()
    }
    return result
  }
}

function delay(duration = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration)
  })
}

async function main() {
  trampoline(asyncTask)()
}

main().catch(console.error)
```
