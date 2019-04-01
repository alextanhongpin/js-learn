# Batch

```js
const batch = (arr = [], bucket = 10) => {
  const len = arr.length
  const num = Math.ceil(len / bucket)
  const result = []
  for (let i = 0; i < num; i += 1) {
    const start = i * bucket
    const end = Math.min((i + 1) * bucket, len)
    result.push(arr.slice(start, end))
  }
  return result
}
```

## Check nested

```js
const obj = {
  a: {
    b: {
      c: 1
    }
  }
}

const dig = (obj, ...keys) => {
  let child = obj
  for (let key of keys) {
    if (child.hasOwnProperty(key)) {
      child = child[key]
      continue
    } 
    return undefined
  }
  return child
}

alert(dig(obj, 'a', 'b', 'd'))
```
