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
