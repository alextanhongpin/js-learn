## Public Class Field

```js
class Vechicle {
  speed = 80

  constructor (type) {
    this.type = type
  }
}

const vehicle = new Vechicle('car')
console.log(vehicle)
```

## Private Class Field

```js
class Counter {
  #count = 0

  increment () {
    this.#count++
  }

  get value () {
    return this.#count
  }
}

const counter = new Counter()
counter.increment()
console.log(counter.value)
console.log(counter.#count)
```
