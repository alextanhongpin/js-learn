## Asynchronous decorator with TypeScript

```js
function delay(duration): Promise<number> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(duration)
        }, duration)
    })
}

class Paper {
    @log
    async measure () {
        console.log('before') 
        const result = await delay(100)
        console.log('after')
        return result
    }
}


function log(target, name, descriptor) {
    const original = descriptor.value
    if (typeof original === 'function') {
        descriptor.value = async function (...args) {
            try {
                console.log('decorator: before')
                const result = await original.apply(this, args)
                console.log('decorator: after')
                return result
            } catch (error) {
                throw error
            }
        }
    }
    return descriptor
}

const paper = new Paper()
paper.measure().then(console.log)
```

Output:

```
decorator: before
before
after
decorator: after
100
```
