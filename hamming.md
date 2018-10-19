Hamming Weight

```js
function main () {
  let v = 1
  v |= (1 << 1)
  v |= (1 << 2)
  v |= (1 << 2)
  v |= (1 << 3)
  v |= (1 << 4)

  let c = 0
  v = v - ((v >> 1) & 0x55555555)                    // reuse input as temporary
  v = (v & 0x33333333) + ((v >> 2) & 0x33333333)     // temp
  c = ((v + (v >> 4) & 0xF0F0F0F) * 0x1010101) >> 24
  console.log(c)
}
```

References:
- https://stackoverflow.com/questions/14555607/number-of-bits-set-in-a-number
- https://en.wikipedia.org/wiki/Hamming_weight
