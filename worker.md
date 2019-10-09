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


## Web Workers

https://hackernoon.com/web-workers-in-react-redux-application-129274e84a4e
https://auth0.com/blog/speedy-introduction-to-web-workers/

https://bitsofco.de/web-workers-vs-service-workers-vs-worklets/
https://developers.google.com/web/updates/2018/08/offscreen-canvas
https://www.freecodecamp.org/news/how-web-workers-can-help-with-consistent-asynchronous-tasks-in-javascript-cd6d728fa4ee/

