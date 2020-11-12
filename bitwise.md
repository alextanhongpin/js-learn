## Bitwise shift operator

What is the difference between the code snippet below? Bitwise shift operator has better performance compared to direct multiplication or division.

Be careful though, the bitwise shift for division will return floored numbers, not the float equivalent. (`10 >> 2`, 10 divide by 4 returns 2, not 2.5, likewise `11 >> 1`, 11 divide by 2 returns 5, not 5.5).

```js
console.time()
for (let i = 0; i < 1_000_000; i++) {
  const b = i / 2
}
for (let i = 0; i < 1_000_000; i++) {
  const b = i * 2
}
console.timeEnd()

console.time()
for (let i = 0; i < 1_000_000; i++) {
  const b = i >> 1
}
for (let i = 0; i < 1_000_000; i++) {
  const b = i << 1
}
console.timeEnd()
```

## Using bitwise for multiple status set check

```js
const status = {
  A: 1 << 0,
  B: 1 << 1,
  C: 1 << 2,
  D: 1 << 3
}
console.log(status)

const bothAAndB = status.A | status.B
console.log(bothAAndB) // 3
console.log(bothAAndB & (status.A)) // 1 Returns the same number if they are set.
console.log(bothAAndB & (status.B)) // 2
console.log(bothAAndB & (status.C)) // 0 Returns 0 if not set.
console.log(bothAAndB & (status.A | status.B)) // 3
console.log(bothAAndB & (status.A | status.B | status.C)) // 3
console.log(bothAAndB === (status.A | status.B)) // true Returns true if is exact set
console.log(bothAAndB === (status.A | status.B | status.C)) // false
```
