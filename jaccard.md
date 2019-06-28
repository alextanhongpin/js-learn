Can be used to find the text similarity.

```js
function union(a, b) {
  return Array.from(new Set(a.concat(b)))
}

console.log(union([1, 2, 3], [3, 4, 3]))
console.log(union([1, 2, 3], []))

function intersect(a, b) {
  if (b.length > a.length) return intersect(b, a)
  const set = new Set(b)
  return a.filter(i => set.has(i))
}

console.log(intersect([1, 2, 3], [3, 2]))
console.log(intersect([3, 2], [1, 2, 3]))
console.log(intersect([3, 2], [1]))

function jaccard(a, b) {
  const num = intersect(a, b).length
  const den = union(a, b).length
  if (!den) return 0
  return num / den
}

const sentences = ['this is a completely plagiarized text', 'this text is completely plagiarized'].map(sent => sent.split(' '))
console.log(jaccard([3, 2], [1]))
console.log(jaccard(...sentences))

function sentenceSimilarity(a, b) {
  const tokenLength = Math.abs(a.length - b.length)
  const characters = Math.abs(a.join('').length - b.join('').length)
  const jaccardDistance = jaccard(a, b)
  return {
    tokenLength,
    characters,
    jaccardDistance
  }
}

console.log(sentenceSimilarity(...sentences))
```

## Normalization of values


```js
const data = Array(10).fill(() => ({
  x: Math.random(),
  y: Math.random()
})).map(fn => fn())

console.log(data)
// Find the normalized data.
const summary = data.reduce((acc, {
  x,
  y
}) => {
  acc.sumX += x
  acc.sumY += y
  acc.minX = x < acc.minX ? x : acc.minX
  acc.maxX = x > acc.maxX ? x : acc.maxX
  acc.minY = y < acc.minY ? y : acc.minY
  acc.maxY = y > acc.maxY ? y : acc.maxY
  return acc
}, {
  sumX: 0,
  sumY: 0,
  minX: Infinity,
  maxX: -Infinity,
  minY: Infinity,
  maxY: -Infinity
})
console.log(summary)
const scaledData = data.map(({
  x,
  y
}) => {
  const scaledX = (x - summary.minX) / (summary.maxX - summary.minX)
  const scaledY = (y - summary.minY) / (summary.maxY - summary.minY)
  return {
    x: scaledX,
    y: scaledY
  }
})
console.log(scaledData)

const weightedData = data.map(({
  x,
  y
}) => {
  return {
    x: x / summary.sumX,
    y: y / summary.sumY
  }
})
console.log(weightedData)
const sum = weightedData.map(({
  x
}) => x).reduce((acc, x) => acc + x, 0)
console.log(sum)
```
