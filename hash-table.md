# Hash table with quadratic probing
```js
class HashTable {
  constructor(size) {
    this.limit = 0
    this.size = size
    this.keys = Array(size).fill(null)
    this.values = Array(size).fill(null)
  }
  hash(n) {
    return n % this.size
  }
  get(key) {
    let hash = this.hash(key)
    let index = 1
    while (this.keys[hash] !== null && this.keys[hash] !== key) {
      hash += Math.pow(index, 2)
      hash = hash % this.size
      index++
    }
    return this.values[hash]
  }
  put(key, value) {
    if (this.limit >= this.size) throw 'hash table is full'
    let hash = this.hash(key)
    let index = 1
    while (this.keys[hash] !== null) {
      hash += Math.pow(index, 2)
      hash = hash % this.size
      index++
    }
    this.keys[hash] = key
    this.values[hash] = value
    this.limit++
  }
  // secondHash(hash) {
  //   const R = this.size - 2
  //   return R - hash % R
  // }
}


const hashTable = new HashTable(5)
hashTable.put(1, 'alpha')
hashTable.put(2, 'beta')
hashTable.put(3, 'cat')
hashTable.put(4, 'delta')
hashTable.put(5, 'emma')

console.log(hashTable.get(1))
console.log(hashTable.get(2))
console.log(hashTable.get(3))
```
