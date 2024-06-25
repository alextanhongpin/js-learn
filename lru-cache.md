```js
class LRUCache {
	cap: number
	cache = new Map()
	constructor(cap: number) {
		this.cap = cap
	}

	add(key: string, val: any) {
		if (this.cache.size >= this.cap) {
			if (this.cache.has(key)) {
				this.cache.delete(key)
			} else {
				this.cache.delete(this.cache.keys().next().value)
			}
		}
		this.cache.set(key, val)
	}

	get(key: string) {
		if (!this.cache.has(key)) {
			throw new Error(`key (${key}) not found`)	
		}

		const val = this.cache.get(key)
		this.cache.delete(key)
		this.cache.set(key, val)
		return val
	}
}

const lru = new LRUCache(3)
lru.add('1', 1)
lru.add('2', 2)
lru.add('3', 3)
lru.add('4', 4)
lru.add('5', 5)
lru.add('1', 1)
lru.add('1', 1)
lru.add('2', 2)

console.log(lru.get('1'))
console.log(lru.get('2'))

console.log(Array.from(lru.cache.keys()))
```
