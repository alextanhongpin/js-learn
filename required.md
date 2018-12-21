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
