## Extending Map

```js
class ExtendedMap extends Map {
	getOrDefault(key, value) {
  	if (cache.has(key)) {
    	return cache.get(key)
    }
    if (value === null || value === undefined) return null
    return cache.set(key, value) && cache.get(key)
  }
}

const cache = new ExtendedMap()
console.log(cache.get('item'))
console.log(cache.getOrDefault('item', 1))
console.log(cache.get('item'))
```
