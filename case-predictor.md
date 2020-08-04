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
function isCapital(str) {
  return /^[A-Z]/.test(str)
}

function stringScore(str = '') {
  const pascal = isCapital(str) ? 1 : 0
  const camel = str.match(/[a-z][A-Z]/g) || []
  const kebab = str.match(/-/g) || []
  const snake = str.match(/_/g) || []
  return {
    pascal,
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

const words = ['this is amazing', 'this_is_amazing', 'thisIsAmazing', 'ThisIsAmazing']
for (let word of words) {
  console.log(word, predictCase(word))
}
```
