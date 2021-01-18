# SetImmediate

When running intensive tasks, always use setImmediate in between to allow other io to perform their task.

```js
let called = 0;

async function sleep(duration = 1000) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

const interval = setInterval(() => {
  called++;
}, 100);

setTimeout(() => {
  clearInterval(interval);
}, 10_000);

function asyncSetImmediate() {
  return new Promise(resolve => {
    setImmediate(() => resolve());
  });
}

async function main() {
  for (let i = 0; i < 1e6; i++) {
    // Fake long running work by logging to output.
    console.log("running", i);
    if (i % 1000 === 0) {
      // If we uncomment this, the number of called will be 0.
      await asyncSetImmediate();
    }
  }
  console.log("called", called);
}

main().catch(console.error);
```
