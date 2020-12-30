# Constant tick

Regardless of the FPS, the distance travelled will always be the same for the given speed:

```js
const FPS = 60 // 30
const deltatime = 1_000 / FPS
const speed = 0.1
let distance = 0
for (let i = 0; i < FPS; i++) {
  distance += speed * deltatime
}
console.log(distance)
```
