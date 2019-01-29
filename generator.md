## Lazy properties of generator

```js
function * multiply(...values) {
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
for (let res of generator) {
}

console.log(generator.next())
```
