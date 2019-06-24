## Version 1

Calculating tf-idf.

```js
const docs = [
  'The cat sat on my face',
  'The dog sat on my bed',
  'I like to watch movie',
  'That movie is awesome'
].map(s => s.split(' '))

// The frequence of words in each documents. The # of words in the document over the total words in the document.
function tf(words) {
  const result = {}
  for (const word of words) {
    if (!result[word]) result[word] = 0
    result[word] += 1
  }
  for (const word in result) {
    result[word] /= words.length
  }
  return result
}
console.log(tf(docs[0]))

// The # of documents with the words. 
function idf(docs) {
  const counts = docs.flatMap(words => [...new Set(words)])
    .reduce((acc, word) => {
      if (!acc[word]) acc[word] = 0
      acc[word] += 1
      return acc
    }, {})


  for (const word in counts) {
    counts[word] = Math.log10(docs.length / counts[word])
  }
  return counts
}

function tfidf(docs) {
  const _idf = idf(docs)
  const _tfs = docs.map(tf)

  return _tfs.map(_tf => {
    for (const word in _idf) {
      if (!_tf[word]) _tf[word] = 0
      _tf[word] = _tf[word] * _idf[word]
    }
    return _tf
  })
}

const results = tfidf(docs)
console.log(results)

function euclidean(v, w) {
  const m = Math.min(v.length, w.length)
  let sum = 0
  for (let i = 0; i < m; i += 1) {
    sum += Math.pow(v[i] - w[i], 2)
  }
  return 1 / (1 + Math.sqrt(sum))
}

console.log(euclidean(
  Object.values(results[0]),
  Object.values(results[1])
))

console.log(euclidean(
  Object.values(results[0]),
  Object.values(results[0])
))

console.log(euclidean(
  Object.values(results[0]),
  Object.values(results[3])
))
console.log(euclidean(
  Object.values(results[2]),
  Object.values(results[3])
))
```


## Version 2

With static methods.

```js
class Counter {
  static count(words) {
    const result = {}
    for (const word of words) {
      if (!result[word]) result[word] = 0
      result[word] += 1
    }
    return result
  }
}

class TFIdf {
  static tf(words) {
    const counter = Counter.count(words)
    for (const key in counter) {
      counter[key] = counter[key] / words.length
    }
    return counter
  }
  static unique(arr) {
    return [...new Set(arr)]
  }
  static idf(documents) {
    const uniqueOccurances = documents.flatMap(words => TFIdf.unique(words))
    const result = Counter.count(uniqueOccurances)
    for (const key in result) {
      result[key] = Math.log10(documents.length / result[key])
    }
    return result
  }
  static tfidf(documents) {
    const tfs = documents.map(words => TFIdf.tf(words))
    const idf = TFIdf.idf(documents)

    return tfs.map(tf => {
      for (const word in idf) {
        // We can choose to skip this to reduce memory usage, since this is a sparse vector.
        if (!tf[word]) tf[word] = 0
        tf[word] *= idf[word]
      }
      return tf
    })
  }
  static distance(v, w) {
    const words = [...new Set(Object.keys(v).concat(Object.keys(w)))]
    let sum = 0
    for (const word of words) {
      sum += Math.pow((v[word] || 0) - (w[word] || 0), 2)
    }
    return 1 / (1 + Math.sqrt(sum))
  }

}
const documents = [
  'I have a cat',
  'I have a dog',
  'The movie is great',
  'I think the cat is cute',
  'The movie is perfect',
  'The cat is cute'
].map(str => str.split(' '))

const result = TFIdf.tfidf(documents)
console.log(TFIdf.distance(result[0], result[result.length - 2]))
console.log(TFIdf.distance(result[0], result[1]))
```
