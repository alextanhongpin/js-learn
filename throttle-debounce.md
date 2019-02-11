## Decorator throttle function

```js
function delay(duration): Promise<boolean> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, duration)
    })
}

function debounce(duration: number) {
    let timeout
    return function (target, name, descriptor) {
        const original = descriptor.value
        if (typeof original === 'function') {
            descriptor.value = async function (...args) {
                console.log('debounce')
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
    @debounce(1000)
    measure () {
        console.log('hello')
        // Unfortunately the debounced function cannot return anything.
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
(4) debounce
hello
debounce
hello
```

## Another Debounce 

```js

function Debouncer(duration: number) {
    let timeout
    return function (fn) {
        console.log('throttled')
        timeout && clearTimeout(timeout)
        timeout = setTimeout(() => {
            fn && fn()
        }, duration)   
    }
}

const debounce = Debouncer(500)
debounce(function () {
    console.log('hello')
})
debounce(function () {
    console.log('hello')
})
debounce(function () {
    console.log('hello')
})
debounce(function () {
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


## Throttle and Debounce

```js
// Throttle: the original function be called at most once per specified period.
function Throttle(duration = 1000) {
  let ts
  return function(fn, ...args) {
    if (!ts) {
      ts = Date.now()
      return fn.apply(this, args)
    }
    if (Date.now() - ts < duration) {
      return null
    }
    ts = null
    return fn.apply(this, args)
  }
}
// Debounce: the original function be called after the caller stops calling the decorated function after a specified period.
function Debounce(duration = 250) {
  let timeout
  return function(fn, ...args) {
    timeout && clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), 250)
  }
}

function delay(duration = 1000, result = true) {
  return new Promise(resolve => setTimeout(resolve, duration, result))
}
async function greet(msg) {
    await delay(1000)
    console.log(msg)
    return msg
  }
  (async function main() {
    const debounce = Debounce()
    debounce(greet, 'debounce')
    debounce(greet, 'debounce')
    debounce(greet, 'debounce')
    debounce(greet, 'debounce')
    const throttle = Throttle(100)
    throttle(greet, 'throttle')
    throttle(greet, 'throttle')
    throttle(greet, 'throttle')
    setTimeout(() => throttle(greet, 'throttle'), 100)
  })().catch(console.error)
```
