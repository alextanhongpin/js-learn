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
