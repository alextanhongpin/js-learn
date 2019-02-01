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
