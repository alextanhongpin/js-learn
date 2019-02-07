# With State Design Pattern

```js
const SECOND = 1000

class CircuitBreakerError extends Error {
  constructor (props) {
    super(props)
    this.name = 'CircuitBreakerError'
  }
}

class CircuitBreaker {
  constructor (threshold = 3, timeout = 3 * SECOND) {
    this.threshold = threshold
    this.timeout = timeout
    this.counter = 0
    this.timestamp = null
    this.state = new Close(this)
  }
  next (state) {
    this.state = state
  }
  handle (task, ...args) {
    return this.state.handle(task, args)
  }
}

class Close {
  constructor (context) {
    this.context = context
    this.context.counter = 0
    this.context.timestamp = null
  }
  async handle (task, ...args) {
    try {
      const result = await task.apply(this, ...args)
      if (this.context.counter > 0) {
        this.context.counter = Math.max(this.context.counter - 1, 0)
      }
      return result
    } catch (error) {
      this.context.counter++
      if (this.context.counter >= this.context.threshold) {
        this.context.next(new Open(this.context))
      }
      throw error
    }
  }
}

class Open {
  constructor (context) {
    this.context = context
    this.context.timestamp = Date.now()
  }
  async handle (task, ...args) {
    if (Date.now() - this.context.timestamp > this.context.timeout) {
      this.context.next(new HalfOpen(this.context))
      throw new CircuitBreakerError('half-open')
    }
    throw new CircuitBreakerError('open')
  }
}

class HalfOpen {
  constructor (context) {
    this.context = context
  }
  async handle (task, ...args) {
    try {
      const result = await task.apply(this, ...args)
      this.context.next(new Close(this.context))
      return result
    } catch (error) {
      this.context.next(new Open(this.context))
      throw error
    }
  }
}

function delay (duration = Math.random() * 1000) {
  return new Promise(resolve => {
    setTimeout(resolve, duration, duration)
  })
}

async function asyncTask (state) {
  await delay()
  if (state) {
    throw new Error('asyncTask: error')
  }
  return Math.random()
}

async function main () {
  const circuit = new CircuitBreaker()
  for (let i = 0; i < 100; i += 1) {
    let state = Math.random() < 0.15 ? 1 : 0
    if (i > 5 && i < 10) {
      state = 1
    }
    try {
      const result = await circuit.handle(asyncTask, state)
      console.log(result)
    } catch (error) {
      if (error instanceof CircuitBreakerError && error.message === 'open') {
        await delay()
      }
      console.log(error)
    }
  }
}

main().catch(console.error)
```

## With Closure
```js
const CLOSED = -1
const SEMI_OPEN = 0
const OPEN = 1

const SECOND = 1000

function CircuitBreaker (threshold = 3, sleepDuration = 5 * SECOND) {
  const state = Object.seal({
    state: CLOSED,
    counter: 0,
    now: null
  })

  const reset = () => {
    state.state = CLOSED
    state.counter = 0
    state.now = null
  }

  const closed = async function (fn, ...args) {
    try {
      const response = await fn.apply(this, args)
      if (state.counter > 0) {
        state.counter = Math.max(0, state.counter - 1)
      }
      return response
    } catch (error) {
      state.counter++
      if (state.counter > threshold) {
        state.state = OPEN
        state.now = Date.now()
        throw new Error('circuit break')
      }
      throw error
    }
  }

  const opened = async function () {
    await delay()
    if (Date.now() - state.now < sleepDuration) {
      throw new Error('opened')
    }
    state.state = SEMI_OPEN
    throw new Error('semi-open')
  }

  const semiOpened = async function (fn, ...args) {
    try {
      const response = await fn.apply(this, args)
      reset()
      return response
    } catch (error) {
      // Change the state back to open
      state.state = OPEN
      state.now = Date.now()
      throw error
    }
  }

  return async function (fn, ...args) {
    switch (state.state) {
      case CLOSED:
        return closed(fn, ...args)
      case OPEN:
        return opened()
      case SEMI_OPEN:
        return semiOpened(fn, ...args)
    }
  }
}

function delay (duration = Math.random() * 1000) {
  return new Promise(resolve => {
    setTimeout(resolve, duration, duration)
  })
}

async function asyncTask (state) {
  console.log('tal', state)
  await delay()
  if (state) {
    throw new Error('asyncTask: error')
  }
  return Math.random()
}

async function main () {
  const cb = CircuitBreaker()
  for (let i = 0; i < 1000; i += 1) {
    try {
      let state = Math.random() < 0.05 ? 1 : 0
      if (i > 10 && i < 15) {
        state = 1
      }
      if (i > 20 && i < 25) {
        state = 1
      }
      const res = await cb(asyncTask, state)
      console.log('result', res)
    } catch (error) {
      console.log('error', error.message)
    }
  }
}

main().catch(console.error)
```
