# AbortController

## Basic
```js
const controller = new AbortController();
console.log(controller.signal.aborted)

controller.signal.addEventListener('abort', console.log)
controller.abort()

console.log(controller.signal.aborted)
```

## Timeout

```js
const signal = AbortSignal.timeout(1000)
signal.addEventListener('abort', console.log)
console.log(signal.aborted)
setTimeout(() => {
	console.log(signal.aborted)
}, 1500)
```

## Any

```js
const controller = new AbortController();
console.log(controller.signal.aborted)

controller.signal.addEventListener('abort', (evt) => console.log('controller', evt))

const signal = AbortSignal.timeout(1000)
signal.addEventListener('abort', evt => console.log('timeout', evt, evt))


const anySignal = AbortSignal.any([ controller.signal, signal ])
// controller.abort()
console.log('anySignal', anySignal.aborted)
setTimeout(() => {
    console.log('anySignal', anySignal.aborted)
}, 1500)
```

## Aborting promises

```js
function asyncTask(signal: AbortSignal) {
    return new Promise((resolve, reject) => {
        if (signal.aborted) reject(new Error('AbortError'))
        
        const abortHandler = () => {
            reject(new Error('AbortError'))
        }
        setTimeout(() => {
            resolve('done')
            signal.removeEventListener('abort', abortHandler)
        }, 1000)

        signal.addEventListener('abort', abortHandler)
    })
}

async function main() {
    const start = performance.now()
    const controller = new AbortController();
    // NOTE: This must be registered first!
    setTimeout(() => {
        controller.abort()
    }, 100)
    const task = await asyncTask(controller.signal)
    const elapsed = (performance.now() - start) + 'ms'
    console.log(elapsed, task)
}

main().catch(console.error)
```
