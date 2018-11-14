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
      result[i*2-1] += u*metrics[i-1]
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
const second = 1000 
const minute = second * 60
const hour = minute * 60
const onemonth = 30 * 24 * hour
console.log(timeString(new Date().getTime()-onemonth))
console.log(timeString(new Date().getTime()-24*hour))
console.log(timeString(new Date().getTime()-14*hour))
console.log(timeString(new Date().getTime()-7*14*hour))
console.log(timeString(new Date().getTime()-50 * second))
console.log(timeString(new Date().getTime()-60 * second))
console.log(timeString(new Date().getTime()-120 * second))
console.log(timeString(new Date().getTime()-126 * second))
console.log(timeString(new Date().getTime()-32 * minute - 10*second))
console.log(timeString(new Date().getTime()-126 * minute))
```

Output:

```
720h
24h
14h
98h
50s
1m
2m
2m6s
32m10s
2h6m
```
