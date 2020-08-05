# Converting string to binary character code

```js
const toBinary = i => i.toString(2)
const toCharCode = s => s.charCodeAt(0)
const alphabets = 'abcdefghijklmnopqrstuvwxyz'
console.log([...alphabets].map(toCharCode).map(toBinary))
```
## Check if a alpha character is upper-case

```js
function isUpperCase(char) {
  return char === char.toUpperCase() && char !== char.toLowerCase()
}

function isUpperCaseRegex(char) {
  return /^[A-Z]$/.test(char)
}

isUpperCase('a')
isUpperCase('A')
isUpperCase('1')
isUpperCaseRegex('a')
isUpperCaseRegex('A')
isUpperCaseRegex('1')
```
