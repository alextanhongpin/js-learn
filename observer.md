# Simple observer pattern in js

```js
interface Observer {
  emit(event: string, ...args: any[]): void
  on(event: string, fn: Function): void
}


class Observable implements Observer {
  private events: Record<string, Function[]> = {};
  emit(event: string, ...args: any[]) {
    if (event in this.events) {
      for (let fn of this.events[event]) {
        fn.apply(this, args)
      }
    }
  }
  on(event: string, fn: Function) {
    if (!(event in this.events)) {
      this.events[event] = []
    }
    this.events[event].push(fn)
  }
}

const obs = new Observable()
obs.on('greet', function (msg: string) {
  console.log(`hello ${msg}!`)
})

obs.emit('greet', 'John')

class ObservableName extends Observable {
  private _name: string
  set name(name: string) {
    this.emit('setName', name)
    this._name = name
  }
  get name() {
    return this._name
  }
}

const obsName = new ObservableName()
obsName.on('setName', (name: string) => {
  console.log('name is set to', name)
})
obsName.name = 'Carl'
```
