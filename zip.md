## python-like zip function

```js
function zip(v, w) {
  if (v.length > w.length) return zip(w, v)
  return v.map((vi, i) => [vi, w[i]])
}

console.log(zip([1, 2, 3], [4, 5]))

function* zipGenerator(v, w) {
  if (v.length > w.length) return yield* zipGenerator(w, v)
  for (let i = 0; i < v.length; i += 1) {
    yield [v[i], w[i]]
  }
}

const gen = zipGenerator([1, 2, 5], [3, 4])
for (let [i, j] of gen) {
  console.log('generator', i, j)
}
```
