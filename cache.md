# Cache API requests client-side in localStorage

```js
const DAY = 24 * 60 * 60 * 1000

function isExpired (timestamp, threshold = 1 * DAY) {
  return (Date.now() - timestamp) / DAY > threshold
}

function snapshot (data, size = 100) {
  let keys = Object.keys(data)

  try {
    let cached = JSON.parse(localStorage.blocks)
    let cachedKeys = Object.keys(cached)
    if (keys.length - cachedKeys.length > size) {
      localStorage.blocks = JSON.stringify(data)
      console.log('snapshot: success')
    }
  } catch (error) {
    console.log('snapshot:', error)
  }
}

class BlockApi {
  constructor () {
    this.cache = {}
    // Attempt to load the blocks from the local storage.
    if (localStorage.blocks) {
      try {
        this.cache = JSON.parse(localStorage.blocks)
        console.log('blockApi: loaded blocks from localStorage')
      } catch (error) {
        console.error(error)
        localStorage.blocks = JSON.stringify({})
      }
    }
  }

  async getBlockByNumber (n) {
    let cachedBlock = this.cache[n]
    if (!cachedBlock || (cachedBlock && isExpired(cachedBlock.updatedAt))) {
      let body = await fetch(`/v1/blocks/${n}`)
      let data = await body.json()

      // Cached the block request.
      this.cache[n] = {
        data,
        updatedAt: Date.now()
      }
      console.log('blockApi: cached block number', n)
    } else {
      console.log('blockApi: read block number', n, 'from cache')
    }

    // Cache this whenever the block difference in the cache and local is
    // greater than the threshold.
    snapshot(this.cache)

    // fetch
    return this.cache[n].data
  }
}

let blockApi = null
async function main () {
  blockApi = new BlockApi()
  for (let i = 0; i < 100; i += 1) {
    await blockApi.getBlockByNumber(i)
  }

  for (let i = 0; i < 100; i += 1) {
    await blockApi.getBlockByNumber(i)
  }

  setTimeout(async () => {
    for (let i = 0; i < 100; i += 1) {
      await blockApi.getBlockByNumber(i)
    }
  }, 5000)
}

main().catch(console.error)
```

## Cache Frequency

Sets the expiration time based on the frequency the data is being called.
```js
class CacheExpired {
  constructor() {
    this.counter = 1
    this.lastTimestamp = Date.now()
    this.nextReset = this.lastTimestamp + 60 * 1000 // 1 Minute
  }
  expired(data) {
    this.counter++
    if (Date.now() > this.nextReset) {
      // Set reset proportional to preveious calls - more frequent means longer to reset 
      this.nextReset = Math.log(this.counter) * 1000 + Date.now()
      // Reset counter 
      this.counter = 1 // Math.log(0) is -infinity
      // Return true means the client need to fetch and set the data in the cache again.
      return true
    }
    return false
  }
}
```

## Caching Asynchronous Task

With `Map`, requires a unique identifier:

```js
function Cache () {
  const cache = new Map()
  return async function (fn, key, ...args) {
    // Why not ...args? Because a new instance is created each time,
    // and WeakMap treats them as a new entry.
    if (cache.has(key)) return cache.get(key)
    const result = await fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}

function delay (duration) {
  console.log('executed')
  return new Promise(resolve => setTimeout(resolve, duration, duration))
}

async function main () {
  const cache = new Cache()
  for (let i = 0; i < 5; i += 1) {
    const result = await cache(delay, 1, 1000)
    console.log(result)
  }
}

main().catch(console.error)
```

With `WeakMap`, the request instance needs to by reference:

```js
function Cache () {
  const cache = new WeakMap()
  return async function (fn, args) {
    // Why not ...args? Because a new instance is created each time,
    // and WeakMap treats them as a new entry.
    if (cache.has(args)) return cache.get(args)
    const result = await fn.apply(this, args)
    cache.set(args, result)
    return result
  }
}

function delay (duration) {
  console.log('executed')
  return new Promise(resolve => setTimeout(resolve, duration, duration))
}

async function main () {
  const cache = new Cache()
  const payload = [1000]
  for (let i = 0; i < 5; i += 1) {
    // This will not be cached - the payload is recreated every time.
    // const result = await cache(delay, [1000])

    // This will be cached.
    const result = await cache(delay, payload)
    console.log(result)
  }
}

main().catch(console.error)
```
