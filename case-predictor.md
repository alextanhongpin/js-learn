## Case Predictor

Predicts whether a string is `camelCase`, `PascalCase`, `snake_case` or `kebab-case`. Useful for applying conversion logic, say if we have a program that converts all the cases to `camelCase`, but we want to optimize the transformation, `kebabToCamelCase`, `pascalToCamelCase`, `snakeToCamelCase`, `anyToCamelCase` or if the string is already camel case, e.g.
```js
const caseType = predictCase(str)
switch (caseType) {
  case 'kebab': kebabToWhateverCase(str)
  ...
}
```

```js
function stringScore(str = '') {
  const pascal = str.match(/^[A-Z]/) || []
  const camel = str.match(/[a-z][A-Z]/g) || []
  const kebab = str.match(/-/g) || []
  const snake = str.match(/_/g) || []
  return {
    pascal: pascal.length,
    camel: camel.length,
    kebab: kebab.length,
    snake: snake.length
  }
}

function caseScore(str, name) {
  const scores = stringScore(str)
  switch (name) {
    case 'kebab':
      return scores.kebab - scores.pascal - scores.snake - scores.camel
    case 'pascal':
      return (scores.pascal + scores.camel) - scores.kebab - scores.snake
    case 'snake':
      return scores.snake - scores.camel - scores.pascal - scores.kebab
    case 'camel':
      return scores.camel - (scores.pascal ? 1 : -1) - scores.kebab - scores.snake
    default:
      throw new Error(`"${name}" is not valid`)
  }
}
const CASES = 'camel kebab pascal snake'.split(' ')

function predictCase(str) {
  const scores = Object.fromEntries(CASES.map(caseType => [caseScore(str, caseType), caseType]))
  return scores[Math.max(...Object.keys(scores).map(Number))]
}

const words = ['this is amazing', 'this_is_amazing', 'thisIsAmazing', 'ThisIsAmazing', 'this-is-amazing', 'this-is amazing  sooo']
for (let word of words) {
  console.log(word, predictCase(word), normalizeCase(word))
}

function normalizeCase(str, delimiter = '-') {
  const pattern = new RegExp(`[^a-z0-9\${delimiter}]`, 'gi')
  const repeated = new RegExp(`${delimiter}+`, 'gi')
  const starting = new RegExp(`^${delimiter}+`, 'gi')
  const ending = new RegExp(`${delimiter}+$`, 'gi')
  return str.replace(pattern, delimiter).replace(repeated, delimiter).replace(starting, '').replace(ending, '')
}

class SnakeCase {
  #str = ''
  constructor(str) {
    this.#str = str
  }
  get camel() {
    const result = this.snake
    return result.charAt(0).toLowerCase() + result.substring(1).replace(/_[a-zA-Z0-9]/g, function(str) {
      return str.charAt(1).toUpperCase()
    })
  }
  get pascal() {
    return this.camel.charAt(0).toUpperCase() + this.camel.substring(1)
  }
  get kebab() {
    return this.snake.replace(/_/g, '-')
  }
  get snake() {
    const normalized = normalizeCase(this.#str.toLowerCase(), '_')
    return normalized
  }
}

class CamelCase {
  #str = ''
  constructor(str) {
    this.#str = str
  }
  get kebab() {
    const result = this.camel.replace(/[a-z][A-Z]/g, function(word) {
      return word.split('').join('-')
    })
    return result.toLowerCase()
  }
  get camel() {
    const result = this.#str.replace(/-[a-z0-9]/gi, function(match) {
      return match.charAt(1).toUpperCase()
    })
    return result.charAt(0).toLowerCase() + result.substring(1)
  }
  get pascal() {
    const result = this.camel
    return result.charAt(0).toUpperCase() + result.substring(1)
  }
  get snake() {
    return this.kebab.replace(/-/g, '_').toLowerCase()
  }
}


class PascalCase {
  #str = ''

  constructor(str) {
    this.#str = str
  }
  get camel() {
    const result = this.pascal
    return result.charAt(0).toLowerCase() + result.substring(1)
  }

  get pascal() {
    const normalize = normalizeCase(this.#str, '_')
    const result = normalize.replace(/_[a-z0-9]/gi, function(match) {
      return match.charAt(1).toUpperCase()
    })
    return result.charAt(0).toUpperCase() + result.substring(1)
  }

  get kebab() {
    const result = this.pascal
    return result.replace(/[a-z][A-Z]/g, function(char) {
      return char.toLowerCase().split('').join('-')
    }).toLowerCase()
  }
  get snake() {
    return this.kebab.replace(/-/g, '_').toLowerCase()
  }
}

class KebabCase {
  #str = ''
  constructor(str) {
    this.#str = str
  }
  get kebab() {
    const normalized = normalizeCase(this.#str, '-')
    return normalized.toLowerCase()
  }
  get snake() {
    return this.kebab.replace(/_/g, '-')
  }
  get camel() {
    const result = this.kebab.replace(/-[a-z]/gi, function(word) {
      return word.charAt(1).toUpperCase()
    })
    return result.charAt(0).toLowerCase() + result.substring(1)
  }
  get pascal() {
    return this.camel.charAt(0).toUpperCase() + this.camel.substring(1)
  }
}

class ObjectCase {
  #str = ''
  constructor(str) {
    this.#str = str
  }
  caseUp() {
    return this.#str.charAt(0).toUpperCase() + this.#str.substring(1)
  }
  caseDown() {
    return this.#str.charAt(0).toLowerCase() + this.#str.substring(1)
  }
}

for (let text of ['this-is-great', 'NiceOne!', 'nice_one_haha', 'niceONe']) {
  const caseType = predictCase(text)
  switch (caseType) {
    case 'snake':
      const snake = new SnakeCase(text)
      console.log('snake', snake.camel, snake.pascal, snake.kebab, snake.snake)
      break
    case 'camel':
      const camel = new CamelCase(text)
      console.log('camel', camel.camel, camel.pascal, camel.kebab, camel.snake)
      break
    case 'pascal':
      const pascal = new PascalCase(text)
      console.log('pascal', pascal.camel, pascal.pascal, pascal.kebab, pascal.snake)
      break
    case 'kebab':
      const kebab = new KebabCase(text)
      console.log('kebab', kebab.camel, kebab.pascal, kebab.kebab, kebab.snake)
      break
    default:
  }
}
```
