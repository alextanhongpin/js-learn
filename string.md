## Different string similarity

```js
// Allows only substitution, hence it only applies to strings of the same length.
function hammingDistance(source, target) {
  if (source.length !== target.length) {
    throw new Error('length must be equal')
  }
  let hamming = 0
  for (let i = 0; i < source.length; i += 1) {
    hamming += source[i] !== target[i]
  }
  return hamming
}

console.log(hammingDistance('karolin', 'kathrin')) // 3
console.log(hammingDistance('1011101', '1001001')) // 2
console.log(hammingDistance('2173896', '2233796')) // 3


function jaroDistance(source, target) {
  const s = source.length
  const t = target.length

  if (s + t === 0) {
    return 1
  }
  const sMatches = Array(s).fill(false)
  const tMatches = Array(t).fill(false)
  // The distance must be less than the match distance.
  const matchDistance = Math.floor(Math.max(s, t) / 2) - 1

  // Find the matching characters in the string that are within the matchDistance. Store them in a hash table.
  let matches = 0
  for (let i = 0; i < s; i += 1) {
    const start = Math.max(0, i - matchDistance)
    const end = Math.min(i + matchDistance + 1, t)
    for (let j = start; j < end; j += 1) {
      if (tMatches[j]) continue
      if (source[i] !== target[j]) continue
      sMatches[i] = true
      tMatches[j] = true
      matches += 1
      break
    }
  }
  if (!matches) return 0

  // Now find the number of transpositions for the equal characters found in the string.
  let k = 0
  let transpositions = 0
  for (let i = 0; i < s; i += 1) {
    // The string does not match.
    if (!sMatches[i]) continue
    while (!tMatches[k]) {
      k += 1
    }
    if (source[i] !== target[k]) {
      transpositions += 1
    }
    k += 1
  }

  return ((matches / s + matches / t + (matches - transpositions / 2) / matches)) / 3
}


console.log(jaroDistance('MARTHA', 'MARHTA')) // 0.9444444444
console.log(jaroDistance('DIXON', 'DICKSONX')) // 0.7666666667
console.log(jaroDistance('JELLYFISH', 'SMELLYFISH')) // 0.8962962963



function jaroWinkler(source, target) {
  const sim = jaroDistance(source, target)
  const commonPrefixLength = Math.min(source.length, target.length, 4)
  let l = 0
  for (let i = 0; i < commonPrefixLength; i += 1) {
    if (source[i] !== target[i]) {
      break
    }
    l += 1
  }
  const p = 0.1 // Winkler's work
  return sim + p * l * (1 - sim)
}

console.log(jaroWinkler('MARTHA', 'MARHTA')) // 0.9611111111111111
console.log(jaroWinkler('DIXON', 'DICKSONX')) // 0.8133333333333332
console.log(jaroWinkler('JELLYFISH', 'SMELLYFISH')) // 0.8962962962962964
```
