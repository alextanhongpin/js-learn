# Branding

```ts
type Brand<K, T> = K & { __brand: T }

type USD = Brand<number, 'USD'>

function printUSD(usd: USD): void {
  console.log(`amount is ${usd}`)
}

const usd = 10 as USD
printUSD(usd)
printUSD(10) // Doesn't work

function createUSD(value: number): USD {
  return value as USD
}
```
