## Freezing state

Sometimes it's useful to freeze the property to prevent changes to the object. But note that this is different than private classes. Once frozen, it can no longer be modified. 
```js
class Paper {
  constructor() {
    this.state = {
      hello: 'world'
    }
    Object.freeze(this.state)
  }
}
const paper = new Paper()
console.log(paper.state)
paper.state.car = 'car'
console.log(paper.state)
// Cannot modify state.
console.log(Object.isFrozen(paper.state))
// But the whole state object can be modified.
paper.state = {
  'car': 'audi'
}
console.log(paper.state)
console.log(Object.isFrozen(paper.state))
Object.freeze(paper)
console.log(Object.isFrozen(paper))
paper.state = {
  hello: 'world'
}
console.log(paper.state)
```

## Private classes

```js
const wm = new WeakMap()
const internal = function (key) {
  if (!wm.has(key)) {
    wm.set(key, {})
  }
  return wm.get(key)  
}

class Paper {
  constructor() {
    internal(this).state = {}
  }
  getSomething() {
    internal(this).state
  }
}
```

## Sealing

The difference between `Object.seal` and `Object.freeze` is the former allows the value to be modified, but new properties cannot be added, while the latter is entirely immutable. `Object.seal` cannot be used with classes:

```js
const obj = {
	key: 'value'
}
const sealedObj = Object.seal(obj)
Object.isSealed(sealedObj) // returns true
sealedObj.newKey = 'car'
console.log(sealedObj) // { key: 'value' }
```
