# Flatten keys and preserve array

```js
const o = {
  user: {
    key_value_map: {
      CreatedDate: '123424',
      Department: {
        Name: 'XYZ'
      }
    }
  },
  john: {
    hello: 'world',
    car: [1, 3, 4]
  }
}

function flatten (obj, parent = '', result = {}) {
  for (let key in obj) {
    const propName = [parent, key].filter(Boolean).join('.')
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      flatten(obj[key], propName, result)
    } else {
      result[propName] = obj[key]
    }
  }
  return result
}

console.log(flatten(o, ''))
```

Output:

```js
{ 'user.key_value_map.CreatedDate': '123424',
  'user.key_value_map.Department.Name': 'XYZ',
  'john.hello': 'world',
  'john.car': [ 1, 3, 4 ] }
```
