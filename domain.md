## Wrapping json in domain object

```js
class User {
  constructor({ firstName, lastName }) {
    this.json = { firstName, lastName }
  }
  get fullName () {
    return [this.json.firstName, this.json.lastName ].join(' ')
  }
}

const user = new User({firstName: 'John', lastName: 'Doe'})
user.fullName
```

## With array

```js
class Users {
  constructor(data = []) {
    this.json = data
  }
  get length () {
    return this.json.length
  }
  withFirstName(firstName) {
    return this.json.find(user => user.firstName === firstName)
  }
  where(key, value) {
    return this.json.find(user => user[key] === value)
  }
}

const user = {firstName: 'John', lastName: 'Doe'}
const users = new Users([user])

console.log(users.withFirstName('John'))
console.log(users.where('firstName', 'John'))
```
