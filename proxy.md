## Proxy

The proxy object is used to define custom behaviour for fundamental operations.

```js
const products = new Proxy([{
    name: 'Firefox',
    type: 'browser'
  },
  {
    name: 'SeaMonkey',
    type: 'browser'
  },
  {
    name: 'Thunderbird',
    type: 'mailer'
  }
], {
  get: function(obj, prop) {

    if (prop in obj) {
      return obj[prop]
    }

    if (prop === 'number') {
      return obj.length
    }

    let result, types = {}
    for (let product of obj) {
      if (product.name === prop) {
        result = product
      }
      if (types[product.type]) {
        types[product.type].push(product)
      } else {
        types[product.type] = [product]
      }
    }
    if (result) return result
    if (prop in types) return types[prop]
    if (prop === 'types') return Object.keys(types)
    return undefined
  }
})

console.log(products[0])
console.log(products['Firefox'])
console.log(products['Chrome'])
console.log(products.browser)
console.log(products.types)
console.log(products.number)
```

## Validation

```js
// Validation
const handler = {
  set(target, prop, value) {
    console.log(target, prop, value)
    const houses = ['Stark', 'Lanister']
    if (prop === 'house' && !houses.includes(value)) {
      throw new Error(`House ${value} does not belong to allowed ${houses}`)
    }
    // target[prop] = value
    return Reflect.set(...arguments)
  }
}

const character = new Proxy({}, handler)
character.name = 'John'
character.house = 'Stark'
console.log(character)

character.house = 'Area51'
```


## Side-effects

```js
const sendEmail = () => {
  console.log('sending email')
}

const handler = {
  set(target, prop, value) {
    if (prop === 'status' && value === 'complete') {
      sendEmail()
    }
    return Reflect.set(...arguments)
  }
}

const tasks = new Proxy({}, handler)
tasks.status = 'complete'
```


## Cache

```js
const cacheTarget = (target, ttl = 60) => {
  const CREATED_AT = Date.now()
  const isExpired = () =>
    (Date.now() - CREATED_AT) / 1000 > ttl

  const handler = {
    get(target, prop) {
      return isExpired() ?
        undefined :
        target[prop]
    }
  }
  return new Proxy(target, handler)
}


const cache = cacheTarget({
  age: 25
}, 1)
console.log(cache.age)

setTimeout(() => {
  console.log(cache.age)
}, 1500)
```


## Allow accessing snake case values

```js
function snakeToCamel(str) {
  return str.replace(/_([a-z0-9])/ig, (match, p1) => p1.toUpperCase())
}
const snakeCaseHandler = {
  get(target, prop, receiver) {
    if (prop in target) {
      return Reflect.get(...arguments)
    }
    const camel = snakeToCamel(prop)
    if (camel in target) {
      return Reflect.get(target, camel, receiver)
    }
    return 'helloo'
  }
}
const obj = {
  hello: 'world',
  helloWorld: 'nice'
}
const o = new Proxy(obj, snakeCaseHandler)
assert(o.helloWorld, o.hello_world)
```
