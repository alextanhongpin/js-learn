# Image to base64

```js
const response = await fetch(‘http://img.png’)
const blob = await response.blob()

const reader = new FileReader()
const base64 = await reader.readAsDataURL(blob)
console.log(base64) 
```
