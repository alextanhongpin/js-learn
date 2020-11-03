# Required Fields

Use Proxy to throw error when the field required is not provided.

```js
const nullHandler = {
	get(object, key) {
  	const value = object[key]
    if (value === null || value === undefined) {
    	throw new Error(`${key} is required`)
    }
    return value
  }
}

const withNullHandler = new Proxy({a: 1}, nullHandler)
console.log(withNullHandler.a)
console.log(withNullHandler.ds)
```


## Validating multiple fields

```js
function isDefined(value) {
  return value !== null && value !== undefined
}

function isRequired(obj, ...fields) {
  for (let field of fields) {
    if (!isDefined(obj[field])) {
      throw new Error(`${field} is required`)
    }
  }
}
isRequired({
  hello: 'world'
}, 'hello', 'world', 'car')
// Error: world is required
```

## Validating Multiple Fields v2

```js
function isRequired(obj) {
  for (let key in obj) {
    const isDefined = obj[key] !== null && obj[key] !== undefined
    if (!isDefined) {
      throw new Error(`${key} is required`)
    }
  }
  return true
}

isRequired({
  hello: '1',
  world: undefined
})
```
