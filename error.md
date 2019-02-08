## Custom Errors

```js
class TimeoutError extends Error {
	constructor(props) {
		super(props)
		this.name = 'TimeoutError'
		this.message = 'timeout exceeded'
	}
}


async function main() {
	try {
		throw new TimeoutError()
	} catch (error) {
		console.log(error instanceof TimeoutError, error.name, error.message)
	}
}

main().then(console.log).catch(console.error)
```

## Alternative Error Handling
```js
async function asyncTask(work, ...args) {
	try {
  	const response = await work.apply(this, args)
    return [response, null]
  } catch (error) {
  	return [null, error]
  }
}

function delay(duration = 1000, response = true) {
	return new Promise(resolve => setTimeout(resolve, duration, response))
}
async function main() {
	const [res, err] = await asyncTask(delay, 1000)
  if (err) {
  	console.log(err)
  }
  console.log(res)
}


main().catch(console.error)
```
