```js
function levenshtein(s, t) {
  const [m, n] = [s.length + 1, t.length + 1]
  const d = Array(m).fill(() => Array(n).fill(0)).map(fn => fn())

  for (let j = 1; j < n; j += 1) {
    d[0][j] = j
  }
  for (let i = 1; i < m; i += 1) {
    d[i][0] = i
  }
  // console.log(d)
  for (let j = 1; j < n; j += 1) {
    for (let i = 1; i < m; i += 1) {
      const substitutionCost = s[i - 1] === t[j - 1] ? 1 : 0
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // Deletion.
        d[i][j - 1] + 1, // Insertion.
        d[i - 1][j - 1] + substitutionCost // Substitution.
      )
    }
  }
  return d[m - 1][n - 1]
}

console.log(levenshtein('a', 'abc'))
```
