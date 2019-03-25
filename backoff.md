## Simple backoff algorithm


```js
const SECOND = 1000
const timeouts = [0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100].map(i => i * SECOND)

async function delay(duration = 1000) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true)
      }, duration)
  })
}

async function backoff(attempts = 0) {
    const duration = jitter(timeouts[attempts])
    console.log('sleeping for', duration, attempts)
    await delay(duration) 
}

function jitter(duration = 1000) {
  return duration / 2 + Math.round(Math.random() * duration)
}

async function main() {
  let attempts = 0
  for (let i = 0; i < 100; i += 1){
    console.log('iteration:', i)
    await backoff(attempts)
    try {
      if (Math.random() < 0.2) {
        throw new Error('bad error')
      }
      attempts = 0
    } catch (error) {
      console.log(error.message, 'iteration =', i)
      attempts++
    }
  }
}

main().catch(console.error)
```
