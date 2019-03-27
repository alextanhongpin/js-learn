# Implementation

- See older version written in [typescript](https://github.com/alextanhongpin/circuit-retry)
- alternative with [backoff](https://github.com/alextanhongpin/js-learn/blob/master/backoff.md)

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

## Based on UML state diagram

```js
const SECOND = 1000

const initialState = {
  failureCounter: 0,
  failureThreshold: 5,
  successCounter: 0,
  successThreshold: 5,
  timer: null,
  timeout: 5 * SECOND
}

class CircuitBreaker {
  constructor (state = { ...initialState }) {
    this.algorithm = new Closed(state)
  }
  async debug (fn, ...args) {
    if (this.algorithm instanceof Closed) {
      console.log('state: Closed')
    }
    if (this.algorithm instanceof Opened) {
      console.log('state: Opened')
    }
    if (this.algorithm instanceof HalfOpened) {
      console.log('state: Half-Opened')
    }
    return this.do(fn, ...args)
  }
  async do (fn, ...args) {
    return this.algorithm.next(this).do(fn, ...args)
  }
}

class Closed {
  constructor (state) {
    this.state = this.resetFailureCounter(state)
  }
  next (circuitBreaker) {
    circuitBreaker.algorithm = this.isFailureThresholdReached()
      ? new Opened(this.state)
      : this
    return circuitBreaker.algorithm
  }
  resetFailureCounter (state) {
    return {
      ...state,
      failureCounter: 0
    }
  }
  isFailureThresholdReached () {
    const {
      failureCounter,
      failureThreshold
    } = this.state
    return failureCounter > failureThreshold
  }
  incrementFailureCounter (state) {
    return {
      ...state,
      failureCounter: state.failureCounter + 1
    }
  }
  async do (fn, ...args) {
    try {
      const result = await fn.apply(this, args)
      return result
    } catch (error) {
      this.state = this.incrementFailureCounter(this.state)
      throw error
    }
  }
}

class Opened {
  constructor (state) {
    this.state = this.startTimeoutTimer(state)
  }
  startTimeoutTimer (state) {
    return {
      ...state,
      timer: Date.now()
    }
  }
  next (circuitBreaker) {
    circuitBreaker.algorithm = this.isTimeoutTimerExpired()
      ? new HalfOpened(this.state)
      : this
    return circuitBreaker.algorithm
  }
  async do (fn, ...args) {
    throw new Error('too many requests')
  }
  isTimeoutTimerExpired () {
    const {
      timer,
      timeout
    } = this.state
    return Date.now() - timer > timeout
  }
}

class HalfOpened {
  constructor (state) {
    this.state = this.resetSuccessCounter(state)
    this.failed = false
  }
  resetSuccessCounter (state) {
    return {
      ...state,
      successCounter: 0
    }
  }
  incrementSuccessCounter (state) {
    return {
      ...state,
      successCounter: state.successCounter + 1
    }
  }
  isSuccessCountThresholdReached () {
    const {
      successCounter,
      successThreshold
    } = this.state
    return successCounter > successThreshold
  }
  next (circuitBreaker) {
    circuitBreaker.algorithm = this.isSuccessCountThresholdReached()
      ? new Closed(this.state)
      : this.failed
        ? new Opened(this.state)
        : this
    return circuitBreaker.algorithm
  }
  async do (fn, ...args) {
    try {
      const result = await fn.apply(this, args)
      this.state = this.incrementSuccessCounter(this.state)
      return result
    } catch (error) {
      this.failed = true
      throw error
    }
  }
}

async function delay (duration = 1000, value = true) {
  return new Promise((resolve, reject) =>
    setTimeout(() => resolve(value), duration))
}

async function task (fail) {
  if (fail) {
    throw new Error('bad request')
  }
  await delay(100)
  return 'completed'
}
async function main () {
  console.log('starting')
  const state = {
    ...initialState,
    timeout: 1 * SECOND
  }
  const cb = new CircuitBreaker(state)
  for (let i = 0; i < 10; i += 1) {
    try {
      const result = await cb.do(task, true)
      console.log('result', result)
    } catch (error) {
      console.log('error', error.message)
    }
  }

  await delay(1250)

  for (let i = 0; i < 10; i += 1) {
    try {
      const result = await cb.do(task, false)
      console.log('result', result)
    } catch (error) {
      console.log('error', error.message)
    }
  }
}

main().catch(console.error)

// Closed
// entry/ reset failure counter
// do/ if operation succeeds
// return result
// else
// increment failure counter
// return failure
// -> Failure threshold reached

// Open
// entry/start timeout timer
// do/ return failure
// exit
// -> Timeout timer expired
// <- Operation Failed

// Half-open
// entry/ reset success counter
// do/ if operation succeeds
// increment success counter
// return result
// else
// return failure
// -> Success count threshold reached
```

## Another Version
```js
const SECOND = 1000
const CLOSED = 'CLOSED'
const OPENED = 'OPENED'
const HALF_OPENED = 'HALF_OPENED'

const initialState = {
  failureCounter: 0,
  failureThreshold: 5,
  successCounter: 0,
  successThreshold: 5,
  timer: null,
  timeout: 5 * SECOND,
  state: CLOSED,
  error: false
}

function resetFailureCounter (state) {
  return {
    ...state,
    state: CLOSED,
    failed: false,
    failureCounter: 0
  }
}

function isFailureThresholdReached (state) {
  // console.log('isfaileure', state)
  const {
    failureCounter,
    failureThreshold
  } = state
  return failureCounter > failureThreshold
}

function startTimeoutTimer (state) {
  return {
    ...state,
    state: OPENED,
    error: false,
    timer: Date.now()
  }
}

function CircuitBreaker (state = { ...initialState }) {
  const transitions = {
    [CLOSED]: (state) => isFailureThresholdReached(state)
      ? startTimeoutTimer(state)
      : state,
    [OPENED]: (state) => isTimeoutTimerExpired(state)
      ? resetSuccessCounter(state)
      : state,
    [HALF_OPENED]: (state) => isSuccessCountThresholdReached(state)
      ? resetFailureCounter(state)
      : state.error
        ? startTimeoutTimer(state)
        : state
  }
  const execute = {
    [CLOSED]: async (fn, ...args) => {
      try {
        const result = await fn.apply(this, args)
        return result
      } catch (error) {
        state = incrementFailureCounter(state)
        throw error
      }
    },
    [OPENED]: (fn, ...args) => {
      throw new Error('too many requests')
    },
    [HALF_OPENED]: async (fn, ...args) => {
      try {
        const result = await fn.apply(this, args)
        state = incrementSuccessCounter(state)
        return result
      } catch (error) {
        state.error = true
        throw error
      }
    }
  }

  return function (fn, ...args) {
    state = transitions[state.state](state)
    return execute[state.state](fn, ...args)
  }
}

function incrementFailureCounter (state) {
  return {
    ...state,
    failureCounter: state.failureCounter + 1
  }
}

function isTimeoutTimerExpired (state) {
  const {
    timer,
    timeout
  } = state
  return Date.now() - timer > timeout
}

function resetSuccessCounter (state) {
  return {
    ...state,
    state: HALF_OPENED,
    successCounter: 0
  }
}
function incrementSuccessCounter (state) {
  return {
    ...state,
    successCounter: state.successCounter + 1
  }
}
function isSuccessCountThresholdReached (state) {
  const {
    successCounter,
    successThreshold
  } = state
  return successCounter > successThreshold
}

async function delay (duration = 1000, value = true) {
  return new Promise((resolve, reject) =>
    setTimeout(() => resolve(value), duration))
}

async function task (fail) {
  if (fail) {
    throw new Error('bad request')
  }
  await delay(100)
  return 'completed'
}

async function main () {
  console.log('starting')
  const state = {
    ...initialState,
    timeout: 1 * SECOND
  }
  const cb = CircuitBreaker(state)
  for (let i = 0; i < 10; i += 1) {
    try {
      const result = await cb(task, true)
      console.log('result', result)
    } catch (error) {
      console.log('error', error.message)
    }
  }

  await delay(1250)

  for (let i = 0; i < 10; i += 1) {
    try {
      const result = await cb(task, false)
      console.log('result', result)
    } catch (error) {
      console.log('error', error.message)
    }
  }
}

main().catch(console.error)
```

## Alternative implementation

This implementation does not wrap the function that needs to be executed.

```js
const time = {
    Millisecond: 100,
    Second: 1000,
    Minute: 1000 * 60,
    Hour: 1000 * 60 * 60,
    Day: 1000 * 60 * 60 * 24,
}

const CLOSED = 'closed'
const OPENED = 'opened'
const HALF_OPENED = 'half-opened'


function CircuitBreaker({
    successThreshold = 5,
    failureThreshold = 5,
    timeout = 5 * time.Second
} = {}) {
    const state = Object.seal({
        successCounter: 0,
        failureCounter: 0,
        successThreshold,
        failureThreshold,
        timer: null,
        timeout,
        type: CLOSED,
        isOperationFailed: false
    })

    const isFailureThresholdReached = () => state.failureCounter > state.failureThreshold
    const isTimeoutTimerExpired = () => Date.now() - state.timer > state.timeout
    const isOperationFailed = () => state.isOperationFailed
    const isSuccessCountThresholdReached = () => state.successCounter > state.successThreshold
    const incrementSuccessCounter = () => state.successCounter++
    const incrementFailureCounter = () => state.failureCounter++
    const startTimeoutTimer = () => state.timer = Date.now()
    const resetSuccessCounter = () => state.successCounter = 0
    const resetFailureCounter = () => state.failureCounter = 0

    const opened = () => {
        state.type = OPENED
        state.isOperationFailed = false
        startTimeoutTimer()
        return new Error('too many requests')
    }

    const closed = () => {
        state.type = CLOSED
        resetFailureCounter()
    }

    const halfOpened = () => {
        state.type = HALF_OPENED
        resetSuccessCounter()
    }

    const handleSuccessForState = {
        [CLOSED]: () => null,
        [OPENED]: () => null,
        [HALF_OPENED]: () => incrementSuccessCounter()
    }

    const handleErrorForState = {
        [CLOSED]: () => incrementFailureCounter(),
        [OPENED]: () => null,
        [HALF_OPENED]: () => state.isOperationFailed = true
    }


    const transitionWhenConditionIsReached = {
        [CLOSED]: () => isFailureThresholdReached() && opened(),
        [OPENED]: () => isTimeoutTimerExpired() && halfOpened(),
        [HALF_OPENED]: () => isOperationFailed() ?
            opened() : closed()
    }



    return {
        success: () => handleSuccessForState[state.type](),
        error: () => handleErrorForState[state.type](),
        transition: () => transitionWhenConditionIsReached[state.type]()
    }
}

async function task(i) {
    if (i < 10 ||
        i > 30 && i < 40 ||
        i > 40 && i < 50) {
        throw new Error('bad request')
    }

    return true
}

async function delay(duration = 1 * time.Second) {
    return new Promise((resolve, reject) =>
        setTimeout(() => resolve(true), duration)
    )
}

async function main() {
    const cb = new CircuitBreaker({
        timeout: 1 * time.Second
    })
    console.log('start', cb.state)
    let i = 0
    let start = Date.now()
    while (Date.now() - start < 10 * time.Second) {
        i++
        await delay(1 * time.Millisecond)
        const err = cb.transition()
        if (err) {
            console.log(err.message)
            continue
        }
        try {
            const res = await task(i)
            cb.success()
            console.log('success:', res)
        } catch (error) {
            cb.error()
            console.log('error:', error.message)
        }
    }
}

main().catch(console.error)
```
