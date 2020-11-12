# Base62 Encoder/Decoder with JS

```js
const Base62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

function toBase62(n) {
  if (n === 0) return Base62[n]
  let result = ''
  while (n > 0) {
    result = Base62[n % 62] + result
    n = Math.floor(n / 62)
  }
  return result
}

function fromBase62(s) {
  let result = 0
  for (let char of s) {
    result = result * 62 + Base62.indexOf(char)
  }
  return result
}

for (let i = 0; i < 100; i++) {
  console.log(i, toBase62(i), fromBase62(toBase62(i)) === i)
}


const nato = ["Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliett", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "Xray", "Yankee", "Zulu"]

for (let n of nato) {
  console.log(n, fromBase62(n), toBase62(fromBase62(n)) === n)
}
```
