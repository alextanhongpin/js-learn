## Multi-sort by keys


```js
// If the age is smaller, it will appear first.
function byAgeAsc(l, r) {
  // If left value is greater than right value, assign 1 (move to right)
  if (l.age > r.age) {
    return 1
  } else if (l.age < r.age) {
    // If left value is less than right value, assign -1 (move to left)
    return -1
  } else {
    return 0
  }
}

function byNameAsc(l, r) {
  if (l.name === r.name) {
    return 0
  }
  // If left value is smaller than right value, assign -1 (left position),
  // else assign 1 (right position).
  return l.name.localeCompare(r.name)
}

function sortBy(...sortFns) {
  return (a, b) => {
    let result
    for (let sortFn of sortFns) {
      result = sortFn(a, b)
      if (result !== 0) return result
    }
    return result
  }
}

function reverse(orderFn) {
  return function(a, b) {
    return -1 * orderFn(a, b)
  }
}

const users = [{
    name: 'John',
    age: 10,
  },
  {
    name: 'Jessie',
    age: 11
  },
  {
    name: 'Boy',
    age: 11
  },
  {
    name: 'Baby',
    age: 10
  },
  {
    name: 'Adult',
    age: 30
  }
]
console.log([...users].sort(sortBy(byAgeAsc, byNameAsc)))
console.log([...users].sort(sortBy(byAgeAsc, reverse(byNameAsc))))
console.log([...users].sort(sortBy(reverse(byAgeAsc), byNameAsc)))
```

## Alphabetical sorting
Good:
```js
const alphabeticalSorting = (left, right) =>
  left.value < right.value ? -1 : left.value > right.value ? 1 : 0
```

Better:

```js
const alphabetically = (left, right) =>
  left.value.localeCompare(right.value)
```


## Sort by multiple conditions

```js
const data = [
  {age: 10, year: 100},
  {age: 10, year: 1000},
  {age: 10, year: 5},
  {age: 30, year: 10},
  {age: 20, year: 50},
  {age: 25, year: 50},
  {age: 25, year: 20}
]

const sorted = data.sort((left ,right) =>
    (left.age - right.age) || (left.year - right.year))

JSON.stringify(sorted)
```
