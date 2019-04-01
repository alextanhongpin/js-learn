## Testing equality for objects

```js
const stringify = obj => JSON.stringify(Object.entries(obj).sort())
const isEqual = (a, b) => stringify(a) === stringify(b)

const tests = [
    [1, 1],
    [{}, {}],
    [
        [1],
        [1]
    ],
    [
        [{
            a: 1
        }],
        [{
            a: 1
        }]
    ],

    [
        [{
            a: 1,
            b: {
                c: 100
            }
        }],
        [{
            a: 1,
            b: {
                c: 100
            }
        }]
    ],
]

tests.forEach(([a, b]) => {
    console.log(isEqual(a, b))
})
```
