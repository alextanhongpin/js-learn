## Full ICU support for nodejs 13

```js
console.log(
  new Intl.DateTimeFormat('es', { month: 'long' }).format(new Date(9e8))
)
console.log(
  new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(9e8))
)
console.log(new Date().toLocaleString('el', { month: 'long' }))
console.log(new Date().toLocaleString('en', { month: 'long' }))

console.log(
  new Date().toLocaleString('zh', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
)
console.log(
  new Date().toLocaleString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
)
```
