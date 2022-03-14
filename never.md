
## Partially disallow structural typing

```typescript
type VariantA = {
  a: string
}

type VariantB = {
  b: number
}

declare function fn(arg: VariantA | VariantB): void

const input = {a: 'hello', b: 42}
fn(input) // Allowed, but this is not the usecase we want to cover.
```

Solution:
```typescript
type VariantA = {
  a: string
  b?: never 
}

type VariantB = {
  a?: never
  b: number
}

declare function fn(arg: VariantA | VariantB): void

const input = {a: 'hello', b: 42}
fn(input) 

Argument of type '{ a: string; b: number; }' is not assignable to parameter of type 'VariantA | VariantB'.
  Type '{ a: string; b: number; }' is not assignable to type 'VariantB'.
    Types of property 'a' are incompatible.
      Type 'string' is not assignable to type 'undefined'.
```

## Prevent unintended API Usage

```typescript
type Read = {}
type Write = {}
declare const toWrite: Write

declare class MyCache<T, R> {
  put(val: T): boolean;
  get(): R
}

const cache = new MyCache<Write, Read>();
cache.put(toWrite)
```

To design a read-only cache:

```typescript
declare class ReadOnlyCache<R> extends MyCache<never, R> {};

const cache = new ReadOnlyCache<Read>();
cache.put(toWrite) // Argument of type 'Write' is not assignable to parameter of type 'never'.
```



References
- https://www.zhenghao.io/posts/ts-never
