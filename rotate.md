# Dynamically rotating the action

```js
const actionMap = {
  step1() {
    console.log('step 1')
  },
  step2() {
    console.log('step 2')
  },
  step3() {
    console.log('step 3')
  }
}
const actions = Object.keys(actionMap)
for (let i = 0; i < 10; i += 1) {
  const action = actions[i % actions.length]
  // Rotate the action handling.
  actionMap[action]()
}
```
