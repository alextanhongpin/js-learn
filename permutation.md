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


## Permutation 2
```js
function permute(str, prefix = "") {
  if (!str.length) {
    console.log(prefix);
    return;
  }

  for (let i = 0; i < str.length; i++) {
    const first = str.charAt(i);
    const head = str.slice(0, i);
    const tail = str.slice(i + 1);
    permute(head + tail, prefix + first);
  }
}

function permuteArray(arr, prefix = []) {
  if (!arr.length) {
    console.log(prefix);
    return;
  }

  for (let i = 0; i < arr.length; i++) {
    const first = arr[i];
    const head = arr.slice(0, i);
    const tail = arr.slice(i + 1);
    permuteArray(head.concat(tail), prefix.concat(first));
  }
}

permute("ABC");
permuteArray(["A", "B", "C"]);
```
