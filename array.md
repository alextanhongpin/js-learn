# Batch

```js
function batch(arr, bucket = 10) {
  const result = []
  const n = Math.ceil(arr.length / bucket)
  for (let i = 0; i < n; i++) {
    result.push(arr.slice(i * bucket, (i + 1) * bucket))
  }
  return result
}
console.log(batch([1, 2, 3, 4, 5, 6, 7, 8], 3))
// [[1,2,3], [4,5,6], [7,8]]
```

The above solution will compute the batch results, which can be bad for performance as it will take up spaces to store the computed result. A better solution is to use generator so that the batch results will only be computed when it is needed:

```js
function* batch(arr, n = 10) {
  const result = [...arr]
  while (result.length) {
    yield result.splice(0, n)
  }
}

for (const bucket of batch([1, 2, 3, 4, 5, 6, 7, 8], 3)) {
  console.log(bucket)
}
// [1, 2, 3]
// [4, 5, 6]
// [7, 8]
```

## Check nested

This example demonstrates how to safely get nested object keys.

```js
function dig(obj, ...keys) {
  let o = {
    ...obj
  }
  for (let key of keys) {
    if (o.hasOwnProperty(key)) {
      o = o[key]
      continue
    }
    return undefined
  }
  return o
}

const obj = {
  a: {
    b: {
      c: 'hello world'
    }
  }
}
console.log(dig(obj, 'a', 'b', 'c')) // hello world

console.log(dig(obj, 'a')) // { b: { c: 'hello world'}}
console.log(dig(obj, 'x')) // undefined
console.log(dig(obj, 'a', 'b', 'd')) // undefined
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
function sumOfTarget(numbers, target) {
  const cache = {}
  for (let n of numbers) {
    if (cache[target - n]) {
      return [target - n, n]
    } else {
      cache[n] = true
    }
  }
  return null
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const target = 11
console.log(sumOfTarget(numbers, target)) // [5, 6]
```

## Find the two numbers that create the target sum given that the array is sorted.

```js
function sumOfSortedArray(numbers, target) {
  numbers.sort()

  let i = 0
  let j = numbers.length - 1
  while (i < numbers.length - 1 || j > -1) {
    const left = numbers[i]
    const right = numbers[j]
    const result = left + right
    if (result < target) {
      i++
    } else if (result > target) {
      j--
    } else if (result === target) {
      return [left, right]
    } else {
      return null
    }
  }
  return null
}
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const target = 11
console.log(sumOfSortedArray(numbers, target)) // [2, 9]
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


## Print matrix in spiral

```js
const matrix = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20]
]

function spiralMatrix(matrix) {
  let topRow = 0
  let bottomRow = matrix.length - 1
  let leftRow = 0
  let rightRow = matrix[0].length - 1

  while (topRow < bottomRow && leftRow < rightRow) {
    console.log('left to right')
    for (let i = Math.max(0, leftRow - 1); i <= rightRow; i++) {
      console.log(matrix[topRow][i])
    }
    topRow++

    console.log('top to bottom')
    for (let i = topRow - 1; i <= bottomRow; i++) {
      console.log(matrix[i][rightRow])
    }
    rightRow--

    console.log('right to left')
    for (let i = rightRow + 1; i >= leftRow; i--) {
      console.log(matrix[bottomRow][i])
    }
    bottomRow--

    console.log('bottom to top')
    for (let i = bottomRow + 1; i >= topRow; i--) {
      console.log(matrix[i][leftRow])
    }
    leftRow++
  }
}
spiralMatrix(matrix)
```

## Set columns and rows to zero if one of the cell is zero
```js
const m = [
    [0, 2, 3],
    [1, 1, 3],
    [2, 3, 2]
]

function setZeros(matrix) {
    const rows = Array(matrix.length).fill(0)
    const columns = Array(matrix[0].length).fill(0)
    for (let i = 0; i < matrix.length; i += 1) {
        for (let j = 0; j < matrix[i].length; j += 1) {
            if (matrix[i][j] === 0) {
                rows[i] = 1
                columns[j] = 1
            }
        }
    }
    for (let i = 0; i < matrix.length; i += 1) {
        for (let j = 0; j < matrix[i].length; j += 1) {
            if (columns[j] || rows[i]) matrix[i][j] = 0
        }
    }
    return matrix
}

console.log(setZeros(m))
```


## Find what is added/removed from two different array

```js
const arr1 = [1, 2, 4, 9]
const arr2 = [1, 1]

// Find the union of both array.
const combined = [...arr1, ...arr2]
const added = combined.filter(i => !arr1.includes(i))
const removed = combined.filter(i => !arr2.includes(i))

console.log(added, removed)
```
