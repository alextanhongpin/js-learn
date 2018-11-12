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