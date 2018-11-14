# Relative time implementation based on golang's time package

```js
let metrics = [1000, 60, 60, 24]
let symbols = ['ms', 's', 'm', 'h']
function timeString(timestamp, since = Date.now()) {
  let u = since - new Date(timestamp).getTime()
  if (u < 0) {
    u = -u
  }
  if (!u) {
    return '0s'
  }
  let result = []
  let i = 0
  while (u) {
  	// It should not be more than 'hour'.
  	if (i === metrics.length) {
    	result.push(symbols[i-1], u*metrics[i-1])
    	break
    } else {
    	result.push(symbols[i], u % metrics[i])
    }
  	u = Math.floor(u / metrics[i])
  	i+=1
  }
  result = result.reverse().slice(0, 4)
  for (let i = 0; i < result.length; i += 2) {
    if (result[i] === 0) {
      result = result.slice(0, i)
      break
    }
  }
  return result.join('')
}
const onemonth = 30 * 24 * 60 * 60 * 1000
console.log('onemonth', onemonth)
console.log(timeString(new Date().getTime()-onemonth))
```
