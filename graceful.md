## Graceful shutdown

With express

```js
const express = require('express')
const app = express()

const server = app.listen(3000, () => console.log('listening to port*:3000'))


const gracefulShutdown = () => {
  server.close(() => {
    console.log('gracefully shutting down')
    process.exit(0)
  })
  
  setTimeout(() => {
    console.log('forcing shutdown')
    process.exit(1)
  }, 10000)
}
const signals = ['SIGINT', 'SIGTERM', 'SIGHUP']
signals.forEach(sig => process.on(sig, gracefulShutdown))
```

In `Dockerfile`:
```
CMD ["npm", "start"] <- will not work
CMD ["node", "index.js"] <- use this instead
```
