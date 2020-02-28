# RGB to Hex converted

```js
const componentToHex = (c) => {
  const hex = c.toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}

const rgbToHex = (r, g, b) => {
  const hex = [r, g, b].map(componentToHex)
  return `#${hex.join('')}`
}

const rgbStr = `rgb(34, 0, 0)`
const rgb = Array.from(rgbStr.matchAll(/\d+/g)).flatMap(i => parseInt(i[0]))

const hex = rgbToHex(...rgb)
console.log(hex)
```
