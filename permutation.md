## Permutation

- Time complexity: O(n!)
- Space complexity: O(n!)

```js
function swap(arr, i, j) {
  const tmp = arr[i]
  arr[i] = arr[j]
  arr[j] = tmp
}

function* permute(arr, begin = 0, end = arr.length) {
  if (begin === end) {
    yield arr
  }
  for (let i = begin; i < end; i++) {
    swap(arr, begin, i)
    yield* permute(arr, begin + 1, end)
    swap(arr, begin, i)
  }
}


for (let child of permute(['A', 'C', 'D'])) {
  console.log(child)
}
```
