# Sum two linked-list and carry over to right

```js
class LinkedListNode {
  constructor(data) {
    this.data = data
    this.next = null
  }
}

const l1 = new LinkedListNode(3)
l1.next = new LinkedListNode(1)
l1.next.next = new LinkedListNode(5)

const l2 = new LinkedListNode(5)
l2.next = new LinkedListNode(9)
l2.next.next = new LinkedListNode(2)

function addLists(l1, l2, carry) {
  if (l1 === null) return null
  if (l2 === null) return null
  const result = new LinkedListNode(carry)
  let value = carry
  if (l1.data !== null) value += l1.data
  if (l2.data !== null) value += l2.data
  result.data = value % 10
  result.next = addLists(l1.next, l2.next, value > 9)
  return result
}

JSON.stringify(addLists(l1, l2, 0))
```

## Find the last nth node

```js
class LinkedListNode {
  constructor(data) {
    this.data = data
    this.next = null
  }
}

const head = new LinkedListNode('1')
head.next = new LinkedListNode('1')
head.next.next = new LinkedListNode('2')
head.next.next.next = new LinkedListNode('3')

function lastNthNode(head, n = 0) {
  // Validations.
  // Return null if the linked list node does not exists.
  if (head === null) return null
  let p1 = head
  let p2 = head

  for (let i = 0; i < n; i++) {
    p2 = p2.next
    if (p2 === null) return null
  }

  while (p2 !== null) {
    p1 = p1.next
    p2 = p2.next
  }
  return p1
}

console.log(lastNthNode(head, 2))
```

## Remove duplicate from linked list

```js
class LinkedListNode {
  constructor(data) {
    this.data = data
    this.next = null
  }
}

const head = new LinkedListNode('1')
head.next = new LinkedListNode('1')
head.next.next = new LinkedListNode('2')
head.next.next.next = new LinkedListNode('3')


function removeDuplicate(head) {
  // Validations.
  // Return null if the linked list node does not exists.
  if (head === null) return null

  // Store the result in a variable.
  let previous = head
  let current = head.next

  // Loop through all the linked list.
  while (current !== null) {
    let runner = head

    // Always check from the start.
    while (runner !== current) {
      if (runner.data === current.data) {
        const tmp = current.next
        previous.next = tmp
        current = tmp
        break
      }
      runner = runner.next
    }

    if (runner === current) {
      previous = current
      current = current.next
    }
  }
}

removeDuplicate(head)
console.log(head)
```
