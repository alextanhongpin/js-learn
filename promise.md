## Using .allSettled to handle errors

Using `Promise.all` will throw error when one of the operation fails. This can be necessary, but sometimes we just want some calls to fail silently without affecting the whole application.
We can do so with `Promise.allSettled`, by filtering away the operations that failed. Using `flatMap`, we can simplify the operation into a single step:

```js
async function main() {
  const result = await Promise.allSettled([
    Promise.resolve(1),
    Promise.reject('This is bad')
  ])
  const output = result.flatMap(item => item.status === 'fulfilled' ? item.value : [])
  console.log(output)
}
main().catch(console.error)
```
