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


## Why not .toString()

```js
const sortedToString = obj => Object.entries(obj).sort().toString() // a,100,[object Object]
const isEqualToString = (a, b) => sortedToString(a) === sortedToString(b)

const stringifySorted = obj => JSON.stringify(Object.entries(obj).sort())
const isEqual = (a, b) => stringifySorted(a) === stringifySorted(b)

console.log(isEqual({a: '100'}, {a: 100}))
console.log(isEqualToString({a: '100'}, {a: 100})) 

console.log(isEqual({a: ['100', {c: 100}]}, {a: [100, {c:100}]}))
console.log(isEqualToString({a: ['100', {c: 100}]}, {a: [100, {c:100}]}))


console.log(isEqual({a: [100, {c: 100}]}, {a: [100, {c:100}]}))
console.log(isEqualToString({a: [100, {c: 100}]}, {a: [100, {c:100}]}))

console.log(sortedToString({a: [100, {c: 100}]}))
console.log(stringifySorted({a: [100, {c: 100}]}))
```
