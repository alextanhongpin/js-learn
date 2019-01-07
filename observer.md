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
  off(event: string, fn: Function) {
    if (event in this.events) {
      this.events[event] = this.events[event].filter((storedFn: Function) => {
        return storedFn !== fn
      })
      console.log(`${event} is removed`)
    }
  }
  offAll(event: string) {
    delete this.events[event]
  }
}

const obs = new Observable()
function greet(msg: string) {
  console.log(`hello ${msg}!`)
}
obs.on('greet', greet)

obs.emit('greet', 'John')
obs.off('greet', greet)
obs.emit('greet', 'Lennon')

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
