## Builder pattern with chaining

```js
class User {
  name = ''
  age = 0

  constructor({
    name,
    age
  }) {
    this.name = name
    this.age = age
  }

  static get Builder() {
    class Builder {
      setName(name) {
        this.name = name
        return this
      }
      setAge(age) {
        this.age = age
        return this
      }
      build() {
        return new User(this)
      }
    }
    return new Builder()
  }
}


const user = User.Builder
  .setName('john')
  .setAge(10)
  .build()

console.log(user)
```
