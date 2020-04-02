# Example lifecycle

Often for application that requires changes to count, we have two options:

- recompute the count everytime after an operation (create, update, delete)
- partial update of the states

There are several outcomes that could influence the decision, especially in concurrent applications:
- do we need to worry about precision (double actions could lead to negative counts/rating)
- do we need to care about performance (recomputing the whole thing when the number grows big can affect the performance)

Here's an example of partially updating the rating (this is best done in a transaction for concurrent application to avoid data race):

```js
const updateRating = (state, { ratingBefore, ratingAfter }) => {
  const countBefore = state.ratingBreakdown[ratingBefore]
  const countAfter = state.ratingBreakdown[ratingAfter]
  return {
    ...state,
    ratingBreakdown: {
      ...state.ratingBreakdown,
      [ratingBefore]: Math.max(0, countBefore - 1),
      [ratingAfter]: countAfter + 1
    }
  }
}

const initialState = {
  ratingBreakdown: {
    1: 0,
    2: 0,
    3: 1,
    4: 0,
    5: 0
  }
}
console.log(updateRating(initialState, { ratingBefore: 3, ratingAfter: 5}))
```
