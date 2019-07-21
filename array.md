# Batch

```js
const batch = (arr = [], bucket = 10) => {
  const len = arr.length
  const num = Math.ceil(len / bucket)
  const result = []
  for (let i = 0; i < num; i += 1) {
    const start = i * bucket
    const end = Math.min((i + 1) * bucket, len)
    result.push(arr.slice(start, end))
  }
  return result
}
```

## Check nested

```js
const obj = {
  a: {
    b: {
      c: 1
    }
  }
}

const dig = (obj, ...keys) => {
  let child = obj
  for (let key of keys) {
    if (child.hasOwnProperty(key)) {
      child = child[key]
      continue
    } 
    return undefined
  }
  return child
}

alert(dig(obj, 'a', 'b', 'd'))
```

## Array Operation

```js
const array = ['a', 'b', 'c', 'd']

for (let value of array) {
  // Prints the value of the array.
  console.log(value, array.indexOf(value))
}

for (let i in array) {
  // Prints the index of the array.
  console.log(i, array[i])
}

const a = array

// This will all produce a copy of an array.
const b = array.slice()
const c = [...array]
const d = Array.from(array)

array[0] = 1000
console.log(a, b, c, d)
```
## Find two array elements in an array that adds up to a number.

```js
function sumOfTarget(data, target) {
  const hash = {}
  for (let item of data) {
    if (hash[9 - item]) {
      console.log(item, 9 - item)
      return [item, 9 - item]
    }
    hash[item] = true
  }
  return -1
}

console.log(sumOfTarget([1, 2, 3, 4, 5], 9))
```

```js
function sumOfSortedTarget(array, target) {
  array.sort()
  let i = 0
  let j = array.length - 1
  while (i < array.length - 1) {
    const left = array[i]
    const right = array[j]
    if ((left + right) > target) {
      j--
    } else if ((left + right) < target) {
      i++
    } else {
      return [left, right]
    }
  }
  return -1
}
console.log(sumOfSortedTarget([1, 2, 3, 4, 5], 9))
```
## Find the median of two sorted array of the same size.
```js
function median(arr) {
  if (arr.length & 1) {
    return arr[Math.floor(arr.length / 2)]
  }
  return (arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2
}
console.log(median([1, 2, 3, 4]))


function medianOfTwoSortedArray(arr1, arr2) {}
console.log(medianOfTwoSortedArray([1, 2, 3], [4, 5, 6]))
```
## Find common elements in k-sorted array.

```js
{
  const a = [1, 5, 5, 10]
  const b = [3, 4, 5, 5, 10]
  const c = [5, 5, 10, 20]
  const output = [5, 10]

  // Time complexity: O(kn)
  // Space complexity: O(n), n is the longest array length, k is the number of arrays.
  function commonElements(kArray) {
    const hashmap = {}
    for (let array of kArray) {
      let last
      for (let item of array) {
        if (item !== last) {
          last = item
          if (!hashmap[last]) hashmap[last] = 0
          hashmap[last] += 1
        }
      }
    }
    const k = kArray.length
    const result = []
    for (let key in hashmap) {
      if (hashmap[key] === k) {
        result.push(parseInt(key, 10))
      }
    }
    return result
  }
  console.log('common elements', commonElements([a, b, c]))
}
```

```js
const matrix = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20]
]
```
