# Snapshotting

Snapshotting logic, based on redis. There are many use cases to this, such as checking when to execute a periodic background task. We do no want to run the task all the time, but only when the conditions are fulfilled.

```js
let threshold = 0

function execute(count) {
  // Must be sorted from smallest to largest.
  const conditions = [{
      seconds: 5,
      threshold: 10000
    }, // Run every 5 seconds when the threshold is 10,000. Note that it will run at seconds 5, 10, 15...., it is not relative to when the code execute.
    {
      seconds: 60,
      threshold: 1000
    },
    {
      seconds: 300,
      threshold: 100
    },
    {
      seconds: 600,
      threshold: 1
    } // Run every 5 minutes when the threshold is 1. Again, it will run at every 5, 10, 15...minutes.
  ]
  const seconds = Math.floor(Date.now() / 1000)
  return conditions.some((condition) => seconds % condition.seconds === 0 && count >= condition.threshold)
}

setInterval(() => {
  const elapsed = `${Math.floor(Date.now()/1000)} seconds`
  const ok = execute(threshold)
  if (ok) {
    console.log('execute', elapsed)
    threshold = 0
  }
}, 500)

setTimeout(() => {
  threshold = 100000
}, 2500)

setTimeout(() => {
  threshold = 100000
}, 7500)
```
