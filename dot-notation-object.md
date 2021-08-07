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



## Alternative 


```js
function isObject(o) {
  return Object(o) === o && !Array.isArray(o)
}
function splitObjectKeys(obj, separator='.') {
  let result = {}
  for (let key in obj) {
    if (key.includes(separator)) {
      const [part, ...rest] = key.split(separator)
      
      // To avoid '' or 0
      if (result[part] !== undefined) {
        if (!isObject(result[part])) {
          throw new Error('collision on key: ' + part + ' with ' + key)
        }
      } else {
        result[part] = {}
      }
      const tmp = {
        ...result[part],
        [rest.join(separator)]: obj[key]
      }
      const found = result[part][rest[0]]
      if (found !== undefined && !isObject(found)) {
        throw new Error('collision on key: ' + key +' with ' + part + '.' + rest[0])
      }
      result[part] = splitObjectKeys(tmp, separator)
    } else {
      result[key] = isObject(obj[key])
         ? splitObjectKeys(obj[key], separator)
         : result[key] = obj[key]
    }
  }
  return result
}

splitObjectKeys({
  'a.b': 1,
  'a.c': 2,
  // 'a': 1, // cannot set this
  a: {'z': 100},
  a: {'b': 60}, // Overwrites a.b
  'b': 2,
  'c.d': [100], // This will collide with key c.d.e
  // 'c.d.e': [22, 21], // This will not be handled
  // 'c.d.e': [23, 24],
  'a.d': {
    'b.c': 100
  },
  'z': {'a.x': {'a.x': 100}}
})

const out = splitObjectKeys({
  'product_id': 'somthign',
  'product_name': 'hello',
  'item_name': 'foo',
  'item_id': 'bar',
  'item_first_name': 'bar',
  'item_last_name': 'john',
  'item_first_age': 10
}, '_')
out

```
