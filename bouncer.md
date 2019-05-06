## Bouncer Pattern

```js
const isDefined = (value, name) => {
  if (value === undefined || value === null) {
    throw new Error(`"${name}" is required`)
  }
}

const doWork = async (job) => {
  isDefined(job, 'job')
}

const main = async () => {
  doWork()
}

main().catch(console.error)
```

References:
- http://wiki.c2.com/?BouncerPattern
