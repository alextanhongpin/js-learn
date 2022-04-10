## Conjunction and Disjunction

```js
// For 'or', use const lf = new Intl.ListFormat('ms', {type: 'disjunction'});
// ms refers to malaysia language
const lf = new Intl.ListFormat('ms');
lf.format(['Frank']);
// → 'Frank'
lf.format(['Frank', 'Christine']);
// → 'Frank and Christine'
lf.format(['Frank', 'Christine', 'Flora']);
// → 'Frank, Christine, and Flora'
lf.format(['Frank', 'Christine', 'Flora', 'Harrison']);
// → 'Frank, Christine, Flora, and Harrison'
```

Reference
- https://v8.dev/features/intl-listformat

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



function computeLastOccuranceFunction(pattern, alphabets = 26) {
  const alphas = Array(alphabets).fill(-1)
  const a = 'a'.charCodeAt(0)
  for (let i = 0; i < pattern.length; i += 1) {
    const idx = pattern[i].charCodeAt(0) - a
    alphas[idx] = i
  }
  return alphas
}
console.log(computeLastOccuranceFunction('hell'))
```

## Palindrome

```js
function isPalindrome(str) {
  for (let i = 0, mid = str.length / 2; i < mid; i += 1) {
    const start = str[i]
    const end = str[str.length - 1 - i]
    if (start !== end) {
      return false
    }
  }
  return true
}

isPalindrome('racecar')
isPalindrome('iii')
```

## Knuth-Morris-Pratt algorithm for Pattern Search.

Given a text `txt[0..n-1]` and pattern `pat[0..m-1]`, write a function `search(char pat[], char text[])` that prints all occurences of `pat[]` in `txt[]`. You may assume that `n > m`.

Time complexity (worst case): `O(n)`

Basic idea behind KMP: Whenever we detect a mismatch (after some matches), we already know some of the characters in the text of the next window). We take advantage of this information to avoid matching the characters we know will anyway match.

```js
function longestPrefix(str) {
  let prefix = new Array(str.length)
  let maxPrefix = 0
  prefix[0] = 0

  for (let i = 1; i < str.length; i++) {
    while (str.charAt(i) !== str.charAt(maxPrefix) && maxPrefix > 0) {
      maxPrefix = prefix[maxPrefix - 1]
    }
    if (str.charAt(maxPrefix) === str.charAt(i)) {
      maxPrefix++
    }
    prefix[i] = maxPrefix
  }
  return prefix
}

function KnuthMorrisPratt(str, pattern) {
  let prefixTable = longestPrefix(pattern)
  let patternIndex = 0
  let strIndex = 0

  while (strIndex < str.length) {
    if (str.charAt(strIndex) !== pattern.charAt(patternIndex)) {
      // Case 1: The characters are different.
      if (patternIndex !== 0) {
        // Use the prefix table if possible.
        patternIndex = prefixTable[patternIndex - 1]
      } else {
        // Increment the str index to next character.
        strIndex++
      }
    } else if (str.charAt(strIndex) === pattern.charAt(patternIndex)) {
      // Case 2: The characters are the same.
      strIndex++
      patternIndex++
    }

    // Found the pattern.
    if (patternIndex === pattern.length) {
      return true
    }
  }
  return false
}

KMP('sammiebae', 'bae')
KMP('sammiebae', 'sammie')
```


## RobinKarp Search

```js
class RabinKarpSearch {
  constructor() {
    this.prime = 101
  }

  rabinkarpFingerprintHash(str, endLength = str.length) {
    let hashInt = 0
    for (let i = 0; i < endLength; i++) {
      hashInt += str.charCodeAt(i) * Math.pow(this.prime, i)
    }
    return hashInt
  }

  recalculateHash(str, oldIndex, newIndex, oldHash, patternLength = str.length) {
    let newHash = oldHash - str.charCodeAt(oldIndex)
    newHash = Math.floor(newHash / this.prime)
    newHash += str.charCodeAt(newIndex) * Math.pow(this.prime, patternLength - 1)
    return newHash
  }

  strEquals(str1, startIndex1, endIndex1, str2, startIndex2, endIndex2) {
    if (endIndex1 - startIndex1 !== endIndex2 - startIndex2) {
      return false
    }
    while (startIndex1 <= endIndex1 && startIndex2 <= endIndex2) {
      if (str1[startIndex1] !== str2[startIndex2]) {
        return false
      }
      startIndex1++
      startIndex2++
    }
    return true
  }

  rabinkarpSearch(str, pattern) {
    let T = str.length
    let W = pattern.length
    let patternHash = this.rabinkarpFingerprintHash(pattern, W)
    let textHash = this.rabinkarpFingerprintHash(str, W)

    for (let i = 1; i <= T - W + 1; i++) {
      if (patternHash === textHash & this.strEquals(str, i - 1, i + W - 2, pattern, 0, W - 1)) {
        return i - 1
      }
      if (i < T - W + 1) {
        textHash = this.recalculateHash(str, i - 1, i + W - 1, textHash, W)
      }
    }
    return -1
  }
}

const rks = new RabinKarpSearch()
console.log(rks.rabinkarpFingerprintHash('sammie'))
console.log(rks.rabinkarpFingerprintHash('zammie'))

const oldHash = rks.rabinkarpFingerprintHash('sa')
console.log('oldHash', oldHash)
console.log('recalculatedHash', rks.recalculateHash('same', 0, 2, oldHash, 'sa'.length))


console.log(rks.rabinkarpSearch('SammieBae', 'as'))
console.log(rks.rabinkarpSearch('SammieBae', 'Bae'))
console.log(rks.rabinkarpSearch('SammieBae', 'Sam'))
```

## KMP Search

```js
function computeLongestPrefixString(pattern) {
  // The length of the longest prefix.
  let len = 0
  let lps = Array(pattern.length).fill(0)
  let i = 1
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      lps[i] = ++len
      i++
    } else {
      if (len !== 0) {
        len = lps[len - 1]
      } else {
        lps[i] = 0
        i++
      }

    }
  }
  return lps
}

function KMPSearch(text, pattern) {
  const M = pattern.length
  const N = text.length

  const lps = Array(M).fill(0)

  computeLongestPrefixString(pattern, M, lps)

  let j = 0 // Index for pattern.
  let i = 0 // Index for text.
  while (i < N) {
    if (pattern[j] === text[i]) {
      i++
      j++
    }
    if (j === M) {
      console.log('found pattern at', i - j)
      j = lps[j - 1]
    } else if (i < N && pattern[j] !== text[i]) {
      // Mismatch after j matches.
      if (j !== 0) {
        j = lps[j - 1]
      } else {
        i++
      }
    }
  }
}


assert(computeLongestPrefixString('AAAA').toString() === [0, 1, 2, 3].toString())
assert(computeLongestPrefixString('ABCDE').toString() === [0, 0, 0, 0, 0].toString())
assert(computeLongestPrefixString('AABAACAABAA').toString() === [0, 1, 0, 1, 2, 0, 1, 2, 3, 4, 5].toString())
assert(computeLongestPrefixString('AAACAAAAAC').toString() === [0, 1, 2, 0, 1, 2, 3, 3, 3, 4].toString())
assert(computeLongestPrefixString('AAABAAA').toString() === [0, 1, 2, 0, 1, 2, 3].toString())

const text = "ABABDABACDABABCABAB"
const pattern = "ABABCABAB"
console.log(KMPSearch(text, pattern))
```

## Replace with matching

```js
const str = 'this is a great message'

console.log(str.replace('great', 'wonderful'))
console.log(str.replace('great', '$&-$&')) // Match the target.
console.log(str.replace('great', '$`')) // Match the pattern before the target.
console.log(str.replace('great', "$'")) // Match the pattern after the target.
```

## Remove duplicate characters in string string
```js
function removeDuplicate(str) {
    if (str.length < 2) return str

    const ascii = Array(256).fill(false)
    let result = ''
    for (let s of str) {
        const code = s.charCodeAt(0)
        if (ascii[code]) continue
        ascii[code] = true
        result += s
    }
    return result
}

function removeDuplicate2(str) {
    if (str.length < 2) return str
    const ascii = Array(256).fill(false)
    const chars = Array(str.length).fill('')
    ascii[str.charCodeAt(0)] = true
    chars[0] = str[0]
    let tail = 1
    for (let i = 1; i < str.length; i += 1) {
        const code = str.charCodeAt(i)
        if (ascii[code]) continue
        ascii[code] = true
        chars[tail++] = str[i]
    }
    return chars.slice(0, tail).join('')
}

function assert(fn, given, expected) {
    const actual = fn(given)
    console.assert(expected === actual, `given '${given}' expected '${expected}', got '${actual}'`)
}

function testCases(fn) {
    assert(fn, '', '')
    assert(fn, 'a', 'a')
    assert(fn, 'ab', 'ab')
    assert(fn, 'aabbcc', 'abc')
    assert(fn, 'xyzxyz', 'xyz')
    assert(fn, 'hello world', 'helo wrd')
}

testCases(removeDuplicate)
testCases(removeDuplicate2)
```

## Unique Characters

```js
function isUniqueChars(str) {
    let checker = 0
    for (let s of str) {
        const code = s.charCodeAt(0) - 'a'.charCodeAt(0)
        if ((checker & (1 << code)) > 0) return false
        checker |= (1 << code)
    }
    return true
}

function isUniqueChars2(str) {
    let chars = Array(256).fill(0)
    for (let s of str) {
        const code = s.charCodeAt(0)
        if (chars[code]) return false
        chars[code] = true
    }
    return true
}

function test(fn) {
    assert(fn(''))
    assert(fn('abcde'))
    assert(fn('hel'))

    assert(fn('hell') === false)
    assert(fn('aa') === false)
    assert(fn('abcabc') === false)
}

test(isUniqueChars)
test(isUniqueChars2)
```

## Reverse string

To reverse a string, iterate through the midpoint of the string and swap the first and last position of the string.
```js
function reverse(str) {
    const mid = Math.floor(str.length / 2)
    const chars = str.split('')
    for (let i = 0, j = str.length - 1; i < mid; i++, j--) {
        [chars[i], chars[j]] = [chars[j], chars[i]]
    }
    return chars.join('')
}

function test(fn, given, expected) {
    const actual = fn(given)
    console.assert(expected === actual, `given '${given}' expected '${expected}', got '${actual}'`)
}

test(reverse, '', '')
test(reverse, 'a', 'a')
test(reverse, 'ab', 'ba')
test(reverse, 'abcde', 'edcba')
test(reverse, 'abcdef', 'fedcba')
test(reverse, '13a', 'a31')
test(reverse, 'thunder', 'rednuht')
test(reverse, 'thunder ', ' rednuht')
```

## Anagram

```js
function anagram(s, t) {
    return s.split('').sort().join('') === t.split('').sort().join('')
}

function anagram2(s, t) {
    // Validations.
    if (!s.length) return true
    if (s.length !== t.length) return false
    let asciiChars = Array(256).fill(0)
    let uniqueCharacters = 0
    for (let i = 0; i < s.length; i += 1) {
        const code = s.charCodeAt(i)
        if (!asciiChars[code]) {
            uniqueCharacters++
        }
        asciiChars[code]++
    }
    for (let j = 0; j < t.length; j += 1) {
        const code = t.charCodeAt(j)
        if (asciiChars[code] === 0) return false
        asciiChars[code]--
        if (asciiChars[code] === 0) {
            uniqueCharacters--
        }
        if (uniqueCharacters === 0) return t.length - 1 === j
    }
    return false
}


function assert(fn, given, expected) {
    const actual = fn(...given)
    console.assert(expected === actual, `given '${given}' expected '${expected}', got '${actual}'`)
}

function testCases(fn) {
    assert(fn, ['', ''], true)
    assert(fn, ['ab', 'ba'], true)
    assert(fn, ['ab', 'ab'], true)
    assert(fn, ['silent', 'listen'], true)
    assert(fn, ['race', 'care'], true)
    assert(fn, ['elbow', 'below'], true)
    assert(fn, ['stressed', 'desserts'], true)
}

testCases(anagram)
testCases(anagram2)
```

## Replace function

```js
function replaceFun(str, limiter = '%20') {
    let num = 0
    for (let s of str) {
        if (s === ' ') num++
    }
    let newLength = str.length + limiter.length * num
    const chars = Array(newLength).fill('')
    for (let i = str.length - 1; i >= 0; i--) {
        if (str[i] === ' ') {
            for (let j = limiter.length - 1; j >= 0; j--) {
                chars[newLength--] = limiter[j]
            }
        } else {
            chars[newLength--] = str[i]
        }
    }
    return chars.join('')
}

function assert(fn, given, expected) {
    const actual = fn(given)
    console.assert(expected === actual, `given '${given}' expected '${expected}', got '${actual}'`)
}

function testCases(fn) {
    assert(fn, '', '')
    assert(fn, ' ', '%20')
    assert(fn, 'hello world', 'hello%20world')
    assert(fn, '1 2 3', '1%202%203')
    assert(fn, '1  2', '1%20%202')
}

testCases(replaceFun)
```

## Split by capitalized word

```js
const splitCapitalizeRegex = (str) =>
  Array.from(str.match(/[A-Z][a-z]+/g))

console.log(splitCapitalizeRegex('ThisIsTheStringToSplit'))

// Alternative is to use string split.
const splitCapitalize = (str) =>
  str.split(/(?=[A-Z])/g)

console.log(splitCapitalize('ThisIsGreat'))
```

## Types of case
 camelCase; PascalCase; snake_case; kebab-case

## Convert snake_case to camelCase

```sql
function snakeToCamelCase(text) {
  return text.replace(/_[a-z]/g, function(s) { 
    return s.slice(1).toUpperCase() 
  })
}
snakeToCamelCase('hello_world_haha')
```

## Camel to Snake (pascal) case

```js
function camelToSnakeCase(text) {
  return text.replace(/[A-Z]{1}/g, function(char) {
    return `_${char.toLowerCase()}`
  })
}

function isObject(obj) {
  return obj === Object(obj)
}


function snakeCaseObject(o = {}) {
  if (!Object.keys(o).length) return o
  const result = {}
  for (let key in o) {
    const snakeKey = camelToSnakeCase(key)
    const value = o[key]
    result[snakeKey] = isObject(value) ? snakeCaseObject(value) : value
  }
  return result
}
```


## References

- http://www-igm.univ-mlv.fr/~lecroq/string/node14.html
- https://www.javatpoint.com/daa-boyer-moore-algorithm
- https://www.javatpoint.com/daa-knuth-morris-pratt-algorithm


## Detect Separators

```js
function detect(input, separators = [',', ';', '|', '\t', '\n']) {
    const cache = {}
    const count = (sep) => {
        if (sep in cache) return cache[sep]
        return cache[sep] = input.split(sep).length
    }
    return separators.reduce((prev, curr) =>
        count(prev) > count(curr) ? prev : curr
    )
}

detect('hello,world') // Output: ','
```
