# Find changes (add, delete) in an array

```js
// Write JavaScript here and press Ctrl+Enter to execute

let prevState = [{id:0}, {id:1}, {id:2}]
let nextState = [{id:0}, {id:4}]

// Find the difference (what is added, and what is removed from the two different state).
let prevStateCache = new Set(prevState.map(i => i.id))
let nextStateCache = new Set(nextState.map(i => i.id))
let mainCache = new WeakSet(prevState)

for (let state of prevState) {
	if (!nextStateCache.has(state.id)) {
  	console.log('removed', state)
    mainCache.delete(state)
  }
}

for (let state of nextState) {
	if (!prevStateCache.has(state.id)) {
  	console.log('added', state)
    mainCache.add(state)
  }
}

for (let state of [...prevState, ...nextState]) {
	console.log(mainCache.has(state), JSON.stringify(state))
}
```
