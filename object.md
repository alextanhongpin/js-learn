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

## Serializing

This example demonstrates how to override the stringify method for class:

```js
class Hello {
  constructor(name) {
    this.name = name
    this.int = 1
    this.str = 'hello'
    this.bool = false
  }
  toJSON() {
    const o = Object.fromEntries(Object.entries(this))
    return {
      ...o,
      type: this.constructor.name
    }
  }
}

const hello = new Hello('hello world')
JSON.stringify(hello)
```
