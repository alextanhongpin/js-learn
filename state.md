# Sharing readonly state between two classes

```js
class Vector {
	constructor(x = 10, y = 10) {
  	this.x = x 
    this.y = y
  }
  update (x, y) {
  	this.x = x
    this.y = y
  }
}

class Paper {
	constructor (vector) {
  	this.vector = vector
  }
  get x () {
		return this.vector.x
  }
  get y () {
  	return this.vector.y
  }
}


const vector = new Vector()
const paper = new Paper(vector)

console.log(paper.x, paper.y)
console.log(vector)
vector.update(20, -5)
console.log(paper.x, paper.y)
console.log(vector)
```
