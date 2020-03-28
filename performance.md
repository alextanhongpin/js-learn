# Reducing steps

Intead of camping and reducing,  we can reduce with the map function
```js
function sumSquare(numbers = []) {
  return numbers.reduce((l, r) => l + r * r, 0)
}

function sumSquare2(numbers = []) {
  const square = n => n * n
  const sum = (l, r) => l + r
  return numbers.map(square).reduce(sum, 0)
}

if (sumSquare2([1,2,3]) === sumSquare([1,2,3])) {
  alert('hello world')
}
```
