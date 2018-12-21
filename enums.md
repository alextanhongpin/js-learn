## Enums

Dealing with enums in JavaScript is simple, we can just need to ensure it's not modifiable. Note that the keys are lowercase, mainly because it's easier to lowercase the word than to capitalize the word.

```js
const Days = Object.freeze({
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
})
Days.sunday
```
