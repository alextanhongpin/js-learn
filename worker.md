## Simple worker sending at different interval

```js
const SECOND = 1000
async function asyncTask (min=SECOND, max=2 * SECOND) {
	const duration = Math.round(Math.random() * max + min
)
	await delay(duration)
	console.log('doing work', duration)
	return await asyncTask()
}

function delay(duration = 1000) {
	return new Promise((resolve, reject) => {
  	setTimeout(resolve, duration)
  })
}

async function main() {
	asyncTask()
}

main().catch(console.error)
```
