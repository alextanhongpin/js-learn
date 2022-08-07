## Custom Errors

```js
class TimeoutError extends Error {
  constructor(props) {
    super(props)
    this.name = this.constructor.name // 'TimeoutError'
    this.message = 'timeout exceeded'
  }
}
async function main() {
  try {
    throw new TimeoutError()
  } catch (error) {
    console.log(error instanceof TimeoutError, error.name, error.message)
  }
}
main().then(console.log).catch(console.error)
```

## Alternative Error Handling
```js
async function asyncTask(work, ...args) {
  try {
    const response = await work.apply(this, args)
    return [response, null]
  } catch (error) {
    return [null, error]
  }
}

function delay(duration = 1000, response = true) {
  return new Promise(resolve => setTimeout(resolve, duration, response))
}
async function main() {
  const [res, err] = await asyncTask(delay, 1000)
  if (err) {
    console.log(err)
  }
  console.log(res)
}
main().catch(console.error)
```


## Flattening error handling

```js
async function task() {
  return [, new Error('something bad happened')]
}

async function main() {
  const req = {}
  const log = logger.child(req)
  const [result, err] = await task(req)
  if (err) {
    log.error(err)
    return
  }
  console.log(result)
}

async function main() {
  const req = {}
  const log = logger.child(req)
  try {
    const result = await anotherTask(req)
    console.log(result)
  } catch(error) {
    log.error(err)
  }
}
```


## Handling errors separately for each async function

```js
// Returns a given value if exists, or the value of the duration itself, after the given duration.
async function delay(duration = 1000, value = duration) {
  return new Promise(resolve => setTimeout(() => resolve(value), duration))
}

async function doWork(duration) {
  await delay(duration)
  throw new Error('bad request')
}

async function main() {
  try {
    await doWork()
  } catch (err) {
    console.log('error:', err.message)
  }
  try {
    await doWork()
  } catch (err) {
    console.log('error:', err.message)
  }
}

main().catch(console.error)
```

## A look into async error handling

```js

const delay = (duration = 1000) => new Promise((resolve) => setTimeout(resolve, duration))
const task = (error) => {
  if (error) {
      throw new Error('bad')
  }
  return delay(100)
}
const createTask = (error) => {
  return () => task(error)
}


// Immediately exit on error.
async function exitOnError(tasks) {
  let completed = 0
  for await (let task of tasks) {
    try {
      await task()
      completed++
    } catch (error) {
      break
    }
  }
  return completed
}

async function processAllEvenWithError(tasks) {
  const result = await Promise.allSettled(tasks.map(async(task) => task()))
  const completed = result.flatMap(task => task.status === 'fulfilled' ? task.value : [])
  return completed.length
}

async function allOrNone(tasks) {
  try {
    const result = await Promise.all(tasks.map(task => task()))
    return result.length
  } catch (error) {
    return 0
  }
}

async function main() {
  const tasks = [createTask(), createTask(true), createTask()]
  console.log('exitOnError', await exitOnError(tasks))
  console.log('processAllEvenWithError', await processAllEvenWithError(tasks))
  console.log('allOrNone', await allOrNone(tasks))
}

main().catch(console.error)
```


## Typescript Error 

```typescript
interface User {
  id: string
  name: string
}

class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

class UserError extends DomainError {}

class UserNotFoundError extends UserError {
  constructor(userId: string) {
    super(`User (${userId}) not found`)
  }
}

type UserResult = User | UserError

// Problem: errors are not typed ...
function getUserById(id: string): UserResult {
  try {
    throw new UserNotFoundError('xyz')
  } catch(err: any) {
    if (err instanceof UserError) {
      console.log(err.name)
      console.log(err.message)
    }
    return err
  }
} 

const err = getUserById('1')
if (err instanceof UserError) {
  console.log('error finding user', err)
}

// Same goes for Promise - errors are not typed.
async function findUserById(id: string): Promise<User> {
  throw new UserNotFoundError(id)
}

type Ok<T> = {result: T, error?: never}
type Err<E> = {result?: never, error: E}
type Result<T, E> = Ok<T> | Err<E>

// Is this better? User still needs to manually check the types ... 
async function findUserResultById(id: string): Promise<Result<User, UserError>> {
  const error: UserError = new UserNotFoundError(id)
  return { error }
}
```


## Alternative Error Pattern

```typescript
// https://www.reddit.com/r/typescript/comments/ouene2/need_suggestion_for_designing_discriminated_union/

// Create a union type for each error type.
type ValidationError = {
  type: 'ValidationError',
  details: Record<string, string>
}
type DatabaseError = {
  type: 'DatabaseError',
  details: any
}
type LibraryError = {
  type: 'LibraryError',
  details: any
}
type UnknownError = {
  type: 'UnknownError'
}
type ErrorDetails = ValidationError | DatabaseError | LibraryError | UnknownError

// Create a class that extends error that has details property. 
class AppError extends Error {
  details: ErrorDetails

  constructor(message: string, details?: ErrorDetails) {
    super(message)
    this.details = details || { type: 'UnknownError' }
  }

  // Add some factory methods that create errors based on some source.

  static fromMongodb(err: any): AppError {
    if (err instanceof Error) {
      return new AppError(err.message, { type: 'DatabaseError', details: {} })
    }
    return new AppError('Something happened when connecting to MongoDB', { type: 'UnknownError' })
  }

  match<T>(pattern: {
    Validation: (err: ValidationError) => T,
    Database: (err: DatabaseError) => T,
    Library: (err: LibraryError) => T,
    Unknown: () => T,
  }): T {
    if (this.details.type === 'ValidationError') {
      return pattern.Validation(this.details)
    } 
    if (this.details.type === 'DatabaseError') {
      return pattern.Database(this.details)
    }
    if (this.details.type === 'LibraryError') {
      return pattern.Library(this.details)
    }
    return pattern.Unknown()
  }
}

// Use AppError as the Right type
type Result<T> = T | AppError

// Usage.

function fetchUsers(): Promise<Result<Users>> {
  return mongodb.find().catch(AppError.fromMongodb)
}

app.use((err: AppError, req, res, next) => {
  const statusCode = err.match({
    Validation: _ => 400, 
    Database: _ => 501,
    Library: _ => 500,
    Unknown: () => 500
  })
  return res.status(statusCode).send(err.details)
})
```

## Error Cause

Wrapping error is now possible with error cause:
```js
const parentError = new Error("bad request");
const childError = new Error("bad parent", { cause: parentError });
console.log(childError.cause);
```

Be careful when creating custom errors, this will be missing the error cause:
```js
// BAD
class CustomError extends Error {
  constructor() {
    super(arguments)
    this.name = this.constructor.name
  }
}
const child = new Error('bad')
const error = new CustomError('some custom error', {cause: child})
console.log(child.cause, error.cause) // undefined undefined
```

Instead, do this:
```js
// GOOD
class CustomError extends Error {
  constructor(...args) {
    super(...args)
    this.name = this.constructor.name
  }
}

const child = new Error('bad')
const error = new CustomError('some custom error', {cause: child})
console.log(child.cause, error.cause) // undefined Error: 'bad'
```


## Typescript Error Handling

```ts
type Brand<K, T> = K & { __brand: T }

type USD = Brand<number, 'USD'>

class AppError extends Error {
  constructor(...args: any[]) {
    super(...args)
    this.name = this.constructor.name
  }
}

class USDError extends AppError {}

class USDNegativeAmountError extends USDError {
  constructor(amount: number, ...args: any[]) {
    super(`amount cannot be negative: ${amount}`, ...args)
  }
}

class USDParseError extends USDError {
  constructor(input: unknown, ...args: any[]) {
    super(`cannot parse ${JSON.stringify(input)} to USD`, ...args)
  }
}

class USDFactory {
  static create(value: number): USD {
    const usd = value as USD
    USDFactory.validate(usd)

    return usd
  }

  // fromString attempts to cast a string to USD.
  // No validation is done.
  static fromString(value: string): USD {
    const n = Number(value)
    if (isNaN(n)) {
      throw new USDParseError(value)
    }

    return n as USD
  }
  
  // validate validates if the given USD is valid.
  // Otherwise, USDError will be thrown.
  static validate(usd: USD) {
    if (usd < 0) {
      throw new USDNegativeAmountError(usd)
    }
  }
}

try {
  USDFactory.validate(-10 as USD)
} catch (error) {
  if (error instanceof USDError) {
    console.log('is usd error', error)
  }
  if (error instanceof USDNegativeAmountError) {
    console.log('is usd -tive amount error', error.cause)
  }
}

try {
  USDFactory.fromString('hello')
} catch (error) {
  if (error instanceof USDError) {
    console.log('is usd error', error)
  }
  if (error instanceof USDParseError) {
    console.log('is usd parse error', error)
  }
  console.log(error)
}
```
