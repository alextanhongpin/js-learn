## Grep Algorithm

```js
function buildBadMatchTable(str) {
  const result = {}
  for (let i in str) {
    if (!result[str[i]])
      result[str[i]] = str.length - i - 1
  }
  if (!result[str[str.length - 1]])
    result[str[str.length - 1]] = str.length
  return result
}

console.log(buildBadMatchTable('jam'))
console.log(buildBadMatchTable('data'))
console.log(buildBadMatchTable('struct'))
console.log(buildBadMatchTable('roi'))

function boyerMoore(str, pattern) {
  const badMatchTable = buildBadMatchTable(pattern)
  let offset = 0
  let maxOffset = str.length - pattern.length
  let patternLastIndex = pattern.length - 1
  let scanIndex = patternLastIndex

  while (offset <= maxOffset) {
    scanIndex = 0
    while (pattern[scanIndex] === str[scanIndex + offset]) {
      if (scanIndex === patternLastIndex) {
        return offset
      }
      scanIndex++
    }
    var badMatchString = str[offset + patternLastIndex]
    if (badMatchTable[badMatchString]) {
      offset += badMatchTable[badMatchString]
    } else {
      offset += 1
    }
  }
  return -1
}

console.log(boyerMoore('jellyfish', 'jelly'))
console.log(boyerMoore('jellyfish', 'fish'))
```
