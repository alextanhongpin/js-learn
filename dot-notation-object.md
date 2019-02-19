## Object converter from dot notation and vice-versa

```js
// Returns if a value is an object
function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object;
}


function flattenObject(o = {}, prevKey) {
  return Object.entries(o).flatMap(([key, value]) => {
    if (isObject(value)) {
      return flattenObject(value, key)
    }
    return [
      [
        [prevKey, key].filter(Boolean).join('.'), value
      ]
    ]
  })
}

function merge(entries, obj = {}) {
  return entries.reduce((acc, [k, v]) => {
    return toObject(k, v, acc)
  }, obj)
}

function toObject(strDotNotation, value, obj = {}) {
  const keys = strDotNotation.split('.')
  const last = keys.length - 1
  return keys.reduce((o, key, pos) => {
    let child = o
    for (let i = 0; i < pos; i += 1) {
      child = child[keys[i]]
    }
    if (!child[key]) child[key] = {}
    if (pos === last) {
      child[key] = value
    }
    return o
  }, obj)
}

const a = flattenObject({
  name: 'john',
  age: 'doe',
  address: {
    country: "singapore"
  }
})
console.log(a)

console.log(merge(a))
console.log(merge([
  ['address.country', 'singapore']
]))
console.log(toObject('a.b.c', '100', {}))
// Object.fromEntries(a) is not supported yet.```
