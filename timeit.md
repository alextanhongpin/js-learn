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


// loop: took 3.2999999821186066ms
// loop of: took 4.300000029616058ms
// reduce: took 19.899999955669045ms
```
