## Promise.race

Mimicking golang's context cancellation with promises.

```js
function cancel(duration) {
	return new Promise((resolve, reject) => {
  	setTimeout(() => {
    	reject(new Error('timeout exceeded'))
    }, duration)
  })
}

function doWork(duration) {
	return new Promise((resolve, reject) => {
  	setTimeout(() => {
    	resolve(true)
    }, duration)
  })
}

async function main() {
	const result = await Promise.race([cancel(500), doWork(1000)])
  console.log(result)
}

main().then(console.log).catch(console.error)
```
