## Strategy Pattern based on the value.

```js
// Use lowercase or capitals, don't use mixed cases. This makes it easier to build the key.
const Plan = Object.freeze({
  PAID: 'PAID',
  DEFAULT: 'DEFAULT',
  DISCOUNTED: 'DISCOUNTED'
})

const Plans = {
  [Plan.DEFAULT]: () => console.log('default plan'),
  [Plan.PAID]: () => console.log('paid plan'),
  [Plan.DISCOUNTED]: () => console.log('discounted')
}

const PlanStrategy = (plan) => {
  return Plans[plan] || Plans.DEFAULT
}

const strategy = PlanStrategy(Plan.PAID)
strategy() // paid plan
```
