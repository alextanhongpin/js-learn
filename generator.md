## Lazy properties of generator

```js
function* multiply(...values) {
  for (let value of values) {
    const result = value * 2
    yield result
  }
}

const input = Array(1e3).fill(0).map((_, i) => i)

console.time('loop')
for (let i = 0; i < input.length; i += 1) {
  const v = i * 2
}
console.timeEnd('loop')

console.time('for..of')
for (let i of input) {
  const v = i * 2
}
console.timeEnd('for..of')

// Will compute all values.
console.time('map')
const result = input.map(i => i * 2)
console.timeEnd('map')
console.log(result)

// Lazy, will only produce values when called.
console.time('generator')
const generator = multiply(...input)
console.timeEnd('generator')
for (let res of generator) {}

console.log(generator.next())
```


## Endless game

```js
function stateMachine(state = {}) {
  switch (state.result) {
    case 0:
      {
        const result = confirm('what is your choice? [Y/n]')
        if (result) {
          return 1
        } else {
          return 0
        }
      }
    case 1:
      {
        const result = confirm('end now? [Y/n]')
        if (result) {
          return -1

        } else {
          return 0
        }
      }
    default:
      return 0
  }
}

function* game(state) {
  while (true) {
    state.result = stateMachine(state)
    if (state.result < 0) break
    yield
  }
}

const state = {
  result: 0
}
for (let step of game(state)) {

}
```


## Conditional Filtering

```js
function filterGenerator(filterCondition) {
    return function*(data, first = data.length) {
        // Expensive operation. One way to prevent copying of the whole data is to pass in a slice, data.slice(0, 10)
        const copy = [...data.slice(0, first)]
        while (copy.length) {
            // Take the first item. Note that this will mutate the parent data, hence we need to make a copy.
            const head = copy.shift()
            /*
            NOTE: Too complicated, why not just pass one function instead?
            let isValid = false
            for (const condition of conditions) {
                isValid = condition(item)
                if (!isValid) break
            }
            if (isValid) yield item
            */
            if (filterCondition(head)) {
                yield head
            }
        }
    }
}



const isEven = (n) => n % 2 === 0
const isGreaterThan10 = (n) => n > 10

const isEvenLogged = (n) => {
    console.log('isEvenLogged', n)
    return isEven(n)
}

const isGreaterThan10Logged = (n) => {
    console.log('isGreaterThan10Logged', n)
    return isGreaterThan10(n)
}

const data = Array(1000).fill(0).map((_, i) => i)

// NOTE: This has an advantage of short circuiting!
const composedFilter = (n) =>
    isEvenLogged(n) && isGreaterThan10Logged(n)

// NOTE: Do we even need generator when we are limiting the operations in the first place?
const first = 20
for (const result of filterGenerator(composedFilter)(data, first)) {
    console.log('result', result)
}
```
