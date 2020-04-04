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


## queueMicrotask

https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/queueMicrotask


## Worker Threads

```js
const workers = require('worker_threads')

if (workers.isMainThread) {
  const worker = new workers.Worker(__filename, {
    workerData: 41
  })
  worker.on('message', response => {
    console.log('message received')
    console.log(response)
  })
} else {
  workers.parentPort.postMessage(workers.workerData + 1)
}
```

## Single-threaded nodejs

Nodejs is single-threaded, but some libraries in nodejs are not single-threaded.

Libuv set ups a thread pool of four threads to perform OS-related operations by utilizing the power of all the CPU cores. Given our machines has four cores, each thread from the pool is assigned to every core. 

The results is one thread per core. With this setup, all four thread will execute `logHashTime` in each core in parallel - all four functions take similar time.
```js
// Tweak the number of threads in the libuv
// thread pool.
process.env.UV_THREADPOOL_SIZE = 5
const crypto = require('crypto')
const start = Date.now()

function logHashTime () {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('Hash:', Date.now() - start)
  })
}

// When running 5 functions on a computer with 4 cores, the fifth will take longer time to process, because all four cores will be occupied.
logHashTime()
logHashTime()
logHashTime()
logHashTime()
logHashTime()
```
