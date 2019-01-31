## for await...of

```js
async function asyncTask(duration = 1000) {
	return new Promise(resolve => {
  	setTimeout(() => {
    	console.log('completed')
    	resolve(1)
    }, duration)
  })
}

async function main() {
	console.time()
  const tasks = Array(100).fill(() => asyncTask(1000)).map(fn => fn())
	for await (let task of tasks) {
		console.log(task)
  }
  console.timeEnd()
}

main().catch(console.error)

```
