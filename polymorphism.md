## Dealing with polymorphism

One option is for the class to store the `type` of the object and handle the different variation, which violated the open/closed principle.

```js
class Discount {
  type = 'discount'
  percent() {
    switch (this.type) {
      case 'discount':
        return 10
      case 'vip':
        return 20
      default:
        throw new Error('invalid discount type')
    }
  }
}
```

A better way is to create multiple classes which has it's own method to calculate the discount percentage. We can use a factory to create the type when loaded from the database/called from an external source.

```js
class Discount {
  percent() {
    return 10
  }
}

class VIPDiscount extends Discount {
  percent() {
    return 2 * super.percent()
  }
}


function DiscountFactory(type = 'discount') {
  switch (type) {
    case 'discount':
      return new Discount()
    case 'vip':
      return new VIPDiscount()
    default:
      throw new Error('invalid discount type')
  }
}

// Load type from db.
const discount = DiscountFactory('vip')
console.log(discount.percent())
```
