# Singleton

We can apply singleton pattern by just creating a single instance of the class, and applying Object.freeze to the instance:

```js
class Singleton {
  doSomething() {
    console.log('something')
  }
}

const singletonInstance = new Singleton()
Object.freeze(singletonInstance)
console.log(Object.isFrozen(singletonInstance))
export default singletonInstance
```
