## Multi-sort by keys


```js
function byAge(a, b) {
  if (a.age === b.age) {
    return 0
  }
  // Ascending order.
  if (a.age > b.age) {
    // If a is larger than b, increment position of b by 1 in array.
    return 1
  }
  return -1
}

function byName(a, b) {
  if (a.name.length === b.name.length) {
    return 0
  }
  if (a.name.length > b.name.length) {
    return 1
  }
  return -1
}

function reverse(order) {
  return function() {
    return -1 * order.apply(this, arguments)
  }
}

function orderMultiple(...orderFns) {
  return function(a, b) {
    for (let fn of orderFns) {
      const order = fn(a, b)
      if (order !== 0) {
        return order
      }
    }
    return 0
  }
}
const people = [{
  age: 10
}, {
  name: 'john',
  age: 12
}, {
  name: 'johny',
  age: 12
}, {
  age: 22
}]
const sorted = people.sort(orderMultiple(byAge, reverse(byName)))
console.log(JSON.stringify(sorted))
```

## Alphabetical sorting
Good:
```js
const alphabeticalSorting = (left, right) =>
  left.value < right.value ? -1 : left.value > right.value ? 1 : 0
```js

Better:
```
const alphabetically = (left, right) =>
  left.value.localeCompare(right.value)
```


