```js
const Plan = {
  Paid: 'paid',
  Default: 'default',
  Discounted: 'discounted'
}

const Plans = {
  [Plan.Default]: () => console.log('default'),
  [Plan.Paid]: () => console.log('paid'),
  [Plan.Discounted]: () => console.log('discounted')
}

const PlanStrategy = (plan) => {
  return Plans[plan] || Plans[Plan.Default]
}

const strategy = PlanStrategy(Plan.Paid)
strategy()
```
