# Basic implementation of measuring performance time for functions

```ts
function timeit(name: string, fn: Function) {
    const before = performance.now()
    fn()
    const after = performance.now()
    console.log(`${name}: took ${after-before}ms`)
}

const items = Array(1e6).fill(0).map((_, i) => i)



timeit('loop', function () {
  let total = 0
  for (let i = 0; i < items.length; i += 1) {
    total += i
  }
})

timeit('loop of', function () {
  let total = 0
  for (let i of items) {
    total += i
  }
})

timeit('reduce', function () {
  const total = items.reduce((sum, i) => sum + 1, 0)
})
```

Output:

```
loop: took 10.899999993853271ms
loop of: took 42.69999999087304ms
reduce: took 23.099999991245568ms
```
