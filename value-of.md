Overriding `valueOf`. This will convert a class into primitive value.

```js
class Expense {
  constructor(value) {
    this.value = value
  }
  valueOf() {
    return this.value
  }
}

const expenses = [1, 2, 3, 4, 5].map(i => new Expense(i))
console.log(expenses.reduce((a, b) => a + b, 0))

const petrol = new Expense(55)
const grocery = new Expense(34.40)
console.log(petrol + grocery)
```
