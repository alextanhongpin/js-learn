# Using symbol as a unique id

The `Symbol` can be used as a unique key for each object. This however only works on local codebase and the generated id cannot be serialized/deserialized in the storage.

```js
class Obj {
  id: symbol
  constructor(private name: string) {
    this.id = Symbol(name)
  }
}

const a = new Obj('a')
const b = new Obj('b')

const wm = new Map()
wm.set(a.id, a)
wm.set(b.id, b)

for (let key of Array.from(wm.keys())) {
  console.log(wm.get(key))
}

const dict: Record<symbol, Obj> = {
  [a.id]: a,
  [b.id]: b
}

// In order to get all symbols. Object.keys does not work.
const symbolIds = Object.getOwnPropertySymbols(dict)
for (let id of symbolIds) {
  console.log(dict[id])
}
```

# Using symbol as a non-conflicting key name

Adding a new key to an object might overwrite an existing key. A better way is to create a key name with symbol and use it instead.

# Using symbol as a constant/enum

This is to ensure that users do not simply hardcode any value, but import the const/enum and use them instead.
