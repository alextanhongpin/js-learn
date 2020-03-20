
# Ensure equal distribution of data

Say if we want to show questions, answers and comments to display, and the sum of the combination must be equal to five, with at least 2 items from each of them, we can use this approach:

- set a quota of 5
- get two questions, then minus the quota of the number of items we have
- get remaining quota - 2 item for answers. If there are no questions, they will fetch 3 answers.
- get the rest of the quota for comments. If there are no questions and answers, it will be taking 5 comments

```js
let max = 2
let quota = 5

const a = Math.floor(Math.random() * max)
quota -= a
console.log({ a, quota })

const b = Math.floor(Math.random() * (quota - max))
quota -= b
console.log({ b, quota })

const c = Math.floor(Math.random() * (quota))
quota -= c
console.log({ c, quota })
```
