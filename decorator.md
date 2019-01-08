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

## Mixins-style decorator

```ts
// Replace the {} with the Class you want to extend.
// type Constructor<T = {}> = new (...args: any[]) => T;
type Constructor<T = Drawable> = new (...args: any[]) => T;

function Invisibility<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private isInvisible = false
    private timeout: any

    enterInvisibilityMode(duration: number) {
      this.isInvisible = true
      this.timeout && window.clearTimeout(this.timeout)
      this.timeout = window.setTimeout(() => {
        this.isInvisible = true
      }, duration)
    }
  }
}

function HealthBar<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private hpX: number;
    private hpY: number;
    private hp: number;
    draw() {
      super.draw()
      console.log('draw health bar', this.x, this.y)
    }
  } 
}

interface Drawable {
  x: number
  y: number
  draw(): void
}

// This is however tying the functionality straight to the class,
// and therefore not preferable.
// @HealthBar
class Ship implements Drawable {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
  draw() {
    console.log('draw ship', this.x, this.y)
  }
}
// const ship = new Ship()
const ship = new (HealthBar(Ship))(5, 10)
ship.draw()
```
