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
```
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
