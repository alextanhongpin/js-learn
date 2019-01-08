# Use simple const to represent values

Of course we can just create a const `MAX_DELAY_IN_HOURS` too, but `HOUR` is much simpler.
```js
const HOUR = 1

if (delayInHours < 3 * HOUR) {
  // Some business logic here...
}
```
