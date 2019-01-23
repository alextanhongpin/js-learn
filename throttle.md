## Decorator throttle function

```js
function delay(duration): Promise<boolean> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, duration)
    })
}

function throttle(duration: number) {
    let timeout
    return function (target, name, descriptor) {
        const original = descriptor.value
        if (typeof original === 'function') {
            descriptor.value = async function (...args) {
                console.log('throttle')
                timeout && clearTimeout(timeout)
                timeout = window.setTimeout(() => {
                    original.apply(this, args)
                }, duration) 
            }
        }
        return descriptor
    }
}

class Paper {
    @throttle(1000)
    measure () {
        console.log('hello')
        // Unfortunately the throttled function cannot return anything.
        return 'this is something'
    }
}
const paper = new Paper()
paper.measure()
paper.measure()
paper.measure()
paper.measure()

window.setTimeout(() => {
    paper.measure()
}, 2000)
```

Output:
```
(4) throttle
hello
throttle
hello
```

## Another throttle 

```js

function Throttler(duration: number) {
    let timeout
    return function (fn) {
        console.log('throttled')
        timeout && clearTimeout(timeout)
        timeout = setTimeout(() => {
            fn && fn()
        }, duration)   
    }
}

const throttle = Throttler(500)
throttle(function () {
    console.log('hello')
})
throttle(function () {
    console.log('hello')
})
throttle(function () {
    console.log('hello')
})
throttle(function () {
    console.log('hello')
})
```

## Mutex

```js
function delay(duration): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, duration)
  })
}

function mutex() {
  let isLocked = false
  return function (target, name, descriptor) {
    const original = descriptor.value
    if (typeof original === 'function') {
      descriptor.value = async function (...args) {
        if (isLocked) {
          console.log('isLocked')
          return
        }
        isLocked = true
        await original.apply(this, args)
        isLocked = false
      }
    }
    return descriptor
  }
}

class UI {
  @mutex()
  async submit() {
    console.log('submit: before')
    await delay(1000)
    console.log('submit: after')
  }
}

const ui = new UI()
ui.submit()
ui.submit()
ui.submit()

setTimeout(() => {
  ui.submit()
}, 1500)
```
