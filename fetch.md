## Abortable Fetch

Aborting an already ongoing requests:

```js
const controller = new AbortController()
const {
  signal
} = controller

try {
  const response = await fetch('http://localhost:8080', {
    signal
  })
  console.log(response)
} catch (error) {
  console.log(error)
  if (error.name === 'AbortError') {
    console.log('cancelled')
  }
}
// Wait 2 seconds to abort both requests.
setTimeout(() => {
  controller.abort()
}, 2000)



function abortableFetch(request, opts) {
  const controller = new AbortController()
  const signal = controller.signal
  return {
    abort: controller.abort,
    ready: fetch(request, {
      ...ops,
      signal
    })
  }
}
```
