# Flatten keys and preserve array

This example demonstrate how to recursively flatten an object property, taking array and Date object into consideration.

```js
const obj = {
    a: {
        b: {
            c: 1
        },
        d: [1, 2, 3]
    },
    e: {
        f: 'hello',
        g: {
            h: true
        },
        i: new Date()
    }
}

// Edge case with date.
function isDate(unknown) {
    return unknown instanceof Date && !isNaN(unknown)
}

function isObject(unknown) {
    return typeof unknown === 'object' && !Array.isArray(unknown) && !isDate(unknown)
}

function flatten(obj, prevKey, result = {}) {
    for (let key in obj) {
        const combinedKey = [prevKey, key].filter(Boolean).join('.')
        if (isObject(obj[key])) {
            flatten(obj[key], combinedKey, result)
        } else {
            result[combinedKey] = obj[key]
        }
    }
    return result
}

console.log(flatten(obj))
```

Output:

```js
{
  a.b.c: 1
  a.d: (3) [1, 2, 3]
  e.f: "hello"
  e.g.h: true
  e.i: Tue Nov 03 2020 17:41:44 GMT+0800 (Malaysia Time) {}
}
```

## Flatten keys and arrays

```js
const obj = {
  number: 1,
  string: 'hello',
  boolean: 'some boolean',
  nested: {
    hello: 'world',
    another: {
      world: 'hello'
    }
  },
  array: [1, 2, 3],
  anotherArray: [{
      one: 'two'
    }, {
      'three': 4
    },
    [1, 2, 3]
  ],
  test: [
    [1, 2],
    [3, 4]
  ]
}

function isArray(unknown) {
  return Array.isArray(unknown)
}

function isObject(unknown) {
  return unknown === Object(unknown) && !isArray(unknown)
}


function flatten(obj, prefix = null, result = {}) {
  if (isObject(obj)) {
    for (let key in obj) {
      const combinedKey = [prefix, key].filter(Boolean).join('.')
      if (isObject(obj[key])) {
        flatten(obj[key], combinedKey, result)
      } else if (isArray(obj[key])) {
        flatten(obj[key], combinedKey, result)
      } else {
        result[combinedKey] = obj[key]
      }
    }
  } else if (isArray(obj)) {
    const createKey = (i) => [prefix, i].filter(s => s !== null).join('.')
    obj.forEach((item, i) => {
      flatten(item, createKey(i), result)
    })
  } else {
    result[prefix] = obj
  }
  return result
}

console.log(JSON.stringify(flatten(obj), null, 2))
```
Output:
```json
{
  "number": 1,
  "string": "hello",
  "boolean": "some boolean",
  "nested.hello": "world",
  "nested.another.world": "hello",
  "array.0": 1,
  "array.1": 2,
  "array.2": 3,
  "anotherArray.0.one": "two",
  "anotherArray.1.three": 4,
  "anotherArray.2.0": 1,
  "anotherArray.2.1": 2,
  "anotherArray.2.2": 3,
  "test.0.0": 1,
  "test.0.1": 2,
  "test.1.0": 3,
  "test.1.1": 4
}
```

## Serializing

This example demonstrates how to override the stringify method for class, and vice versa from object to class:

```js
class Hello {
  constructor(name) {
    this.name = name
    this.int = 1
    this.str = 'hello'
    this.bool = false
  }
  toJSON() {
    const obj = Object.fromEntries(Object.entries(this))
    return {
      ...obj,
      type: this.constructor.name
    }
  }
  // This can be troublesome if we need to extend the class and reuse.
  static fromJSON(obj) {
    // Dynamic classname.
    const Class = new Function(`return ${this.name}`)()
    const cls = new Class()
    for (let key in obj) {
      if (cls.hasOwnProperty(key)) {
        cls[key] = obj[key]
      }
    }
    return cls
  }
}

const hello = new Hello('hello world')
console.log('cls', hello)
const str = JSON.stringify(hello)
console.log('str', str)
console.log('cls', Hello.fromJSON(JSON.parse(str)))
```
