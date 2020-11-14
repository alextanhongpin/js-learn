# Wordchain

```js
function wordchain(words) {
  const result = {}
  for (let word of words) {
    const [key, value] = word.split('>')
    result[key] = value
  }
  const allCharacters = [...new Set(Object.keys(result).concat(Object.values(result)))]

  const rightValues = new Set(Object.values(result))
  const firstCharacter = allCharacters.find((character) => !rightValues.has(character))

  let word = firstCharacter
  while (result[word[word.length - 1]]) {
    word += result[word[word.length - 1]]
  }
  return word
}

function wordchain2(pairs) {
  const reverseWordMap = {}
  const wordMap = {}
  for (let pair of pairs) {
    const [left, right] = pair.split('>')
    wordMap[left] = right
    reverseWordMap[right] = left
  }
  const allCharacters = Array.from(new Set([...Object.keys(reverseWordMap), ...Object.values(reverseWordMap)]))
  const firstCharacter = allCharacters.find((character) => !reverseWordMap[character])

  let word = firstCharacter
  while (wordMap[word[word.length - 1]]) {
    word += wordMap[word[word.length - 1]]
  }
  return word
}

console.log(wordchain2(['A>N', 'O>I', 'N>O', 'H>A'])) // => HANOI
console.log(wordchain2(['P>O', 'R>E', 'S>I', 'G>A', 'N>G', 'O>R', 'A>P', 'I>N']))
// => SINGAPORE 
```
