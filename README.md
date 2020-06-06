# js-learn
Stuff I learn about js


## MutationObservers, WeakMap, WeakSet JS, CustomElements

Also sharedWorker with websocket. https://blog.pusher.com/reduce-websocket-connections-with-shared-workers/

Build your own approach to designing components without framework.


## Updating npm packages

```bash
$ npm outdated
$ npm i -g npm-check-updated

$ ncu -u
$ npm i
```


## Object-Oriented 


Wrap domain model
- wrap with empty, zero, value, map, find, where, view, parse,  validate, label, with, fulfill, sortable your, filterableby


## Remove unused node modules

```bash
$ find . -name 'node_modules' -type d -prune -print -exec rm -rf '{}' \;
```


## Semantic versioning 

NPM has a command to handle major/minor/patch versioning:
```
$ npm version
```


## Change NVM version when .nvmrc exists

Create `.nvmrc` file:

```bash
node -v > .nvmrc
```

Your `.nvmrc`:
```
v10.16.2
```

Add to `.zshrc`:
```bash
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

### Proxy?

Simplify write to local storage with this:
```
const auth = {
  get token () { 
    return window.localStorage.getItem('accessToken')
  },
  set token (token) {
    token 
    ? window.localStorage.setItem('accessToken', token)
    : window.localStorage.removeItem('accessToken')
  }
}
```

## Using symbol for non-conflicting key value

```js
// Use it to attach metadata, ghost value etc


const name = Symbol("name")

const obj = {
  name: 'hello world'
}

obj[name] = 'secret name'

console.log(obj, obj.name)
console.log(obj[name])

for (let key in obj) {
  console.log('key', key)
}
console.log(name === 'name')

function greet(n) {
  switch (n) {
    case name:
      console.log('heloo')
  }
}
greet('name')
```

## State machine

```js
class State {
  #value = ''
  #transitions = []
  constructor(transitions, initialValue) {
    this.#transitions = transitions
    this.#value = initialValue
  }

  set value(value) {
	// Reduce it to a nested map, then use checking.
    for (let {
        from,
        to,
        fn
      } of this.#transitions) {
      if (from === this.#value && to === value) {
        fn.call(fn)
      }
    }
    this.#value = value
  }

  get value() {
    return this.#value
  }
}


const s = new State([{
    from: 'a', // Allow nested objects.
    to: 'b',
    fn: () => console.log('go to a')
  },
  {
    from: 'b',
    to: 'a',
    fn: () => console.log('back to be a')
  }
], 'a')
s.value = 'b'
s.value = 'a'
```
