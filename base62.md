# Base62 Encoder/Decoder with JS

```js
let chars = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789']

function encode(i) {
  const result = []
  let rem = i
  while (rem > 0) {
    let mod = (rem) % 62
    // Mod zero is 0, but we can't get characters at index -1
    if (!mod) {
      // Set the cycle to 61.
      result.unshift(chars[61])
      // Last character, once divided by 62, will return 1, but we do not need to repeat the cycle. Terminate early.
      if (rem === 62) {
        break
      }
    } else {
      result.unshift(chars[mod - 1])
    }
    rem = Math.floor(rem / 62)
  }
  return result.join('')
}

function decode(s) {
  let sum = 0
  let i = 0
  for (let c of s) {
    sum = sum * 62 + (chars.indexOf(c) + 1)
    i += 1
  }
  return sum
}

let nato = ["Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliett", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "Xray", "Yankee", "Zulu"]

for (let c of nato) {
  if (encode(decode(c)) !== c) {
    console.log('want', c, 'got', encode(decode(c)), decode(c))
  }
}
for (let i = 0; i < 1000000; i += 1) {
  if (!decode(encode(i)) === i) {
    console.log('error')
  }
}
for (let c of chars) {
  if (encode(decode(c)) !== c) {
    console.log('want', c, 'got', encode(decode(c)), decode(c))
  }
}
```
