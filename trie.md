## Trie

```js
class TrieNode {
  constructor(char) {
    this.char = char
    this.children = {}
    this.endword = false
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode()
  }
  insert(str) {
    let curr = this.root
    for (let s of str) {
      const char = s.charCodeAt()
      if (!curr.children[char]) {
        curr.children[char] = new TrieNode(char)
      }
      curr = curr.children[char]
    }
    curr.endword = true
  }

  search(str) {
    let curr = this.root
    for (let s of str) {
      const char = s.charCodeAt()
      if (!curr.children[char]) {
        return false
      }
      curr = curr.children[char]
    }
    return curr.endword
  }
  deleteRecursive(node, str, i = 0) {
    if (i === str.length) {
      if (!node.endword) {
        return false
      }
      node.endword = false
      return Object.keys(node.children).length === 0
    }
    const char = str.charCodeAt(i)
    const currNode = node.children[char]
    if (!currNode) {
      return false
    }
    const shouldDeleteNode = this.deleteRecursive(currNode, str, i + 1)
    if (shouldDeleteNode) {
      delete node.children[char]
      return Object.keys(node.children).length === 0
    }
    return false
  }
  delete(str) {
    return this.deleteRecursive(this.root, str, 0)
  }
}

const trie = new Trie()
trie.insert('alpha')
console.log(trie)
console.log(trie.search('alpha'))
console.log(trie.search('alphas'))
console.log(trie.search('car'))
console.log(trie.delete('alpha'))
console.log(trie.search('alpha'))
console.log(trie)
```
