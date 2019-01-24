# Asynchronous handling for error

```js
function asyncTask() {
  return new Promise((resolve, reject) => {
    Math.random() < 0.5
      ? reject(new Error('invalid number'))
      : resolve(1)
  })
}


async function main() {
  const promises = Array(10).fill(asyncTask).map(async (task) => {
    try {
      const res = await task()
      return res
    } catch (error) {
      console.log('TaskError:', error.message)
      return null
    }
  })

  const result = await Promise.all(promises)
  const response = result.filter((nonNull) => nonNull)
  console.log(response)
  console.log(`${response.length} out of ${result.length} succeed`)
}

main().catch(console.error)
```
