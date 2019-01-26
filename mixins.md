# Basic Mixin

```js
const Mixin1 = superclass => class extends superclass {method1 () {console.log('m1')}}
const Mixin2 = superclass => class extends superclass {method2 () {console.log('m2')}}
const Mixin3 = superclass => class extends superclass {method3 () {console.log('m3')}}
const Mixin4 = superclass => class extends superclass {method4 () {console.log('m4')}}

class Base {}

class Composite extends Mixin1(Mixin2(Mixin3(Mixin4(Base)))) {
  method1 () {
  	super.method1 && super.method1()
    console.log('method 1 mixin!')
  }
}

const composite = new Composite()
composite.method1()
composite.method2()
composite.method3()
composite.method4()

function compose(...mixins) {a
	return function (base) {
  	return mixins.reduce((composite, mixin) => mixin(composite), base)
  }
}

class Composite2 extends compose(Mixin1, Mixin2, Mixin3, Mixin4)(Base) {
  method1 () {
  	super.method1 && super.method1()
    console.log('method 1 mixin!')
  }
}

const composite2 = new Composite2()
composite2.method1()
composite2.method2()
composite2.method3()
composite2.method4()
```
