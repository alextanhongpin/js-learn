## Mutex

Ensures the completion of an operation before executing it again.

```
class Mutex {
  locked = false
  async execute(fn) {
    if (this.locked) {
      console.log('locked')
      return
    }
    this.locked = true
    try {
      await fn()
      console.log('completed')
    } catch (err) {
      throw err
    } finally {
      this.locked = false
    }
  }
}

async function delay(duration = 1000) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(duration), duration))
}

async function main() {
  const mutex = Object.seal(new Mutex())
  mutex.execute(() => delay())
  mutex.execute(() => delay())
  mutex.execute(() => delay())
}

main().catch(console.error)
```
