## Safe counter

A safer way to implement counter without overflow:

```js
function Counter(threshold = 100) {
	let i = 0
	return function () {
  	i = (i + 1) % threshold
    return i === 0
  }
}

const counter = Counter(100)
for (let i = 0; i < 2000; i += 1) {
	if (counter()) {
  	console.log(true)
  }
}
```
