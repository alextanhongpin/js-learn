# Converting string to binary character code

```js
const toBinary = i => i.toString(2)
const toCharCode = s => s.charCodeAt(0)
const alphabets = 'abcdefghijklmnopqrstuvwxyz'
console.log([...alphabets].map(toCharCode).map(toBinary))
```
