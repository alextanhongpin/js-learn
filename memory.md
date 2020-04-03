# Dealing with nodejs memory issue


Short term solution
- restart the application before it crashes
- pm2 can monitor the memory and restart the application when it reaches a certain threshold (max_memory_restart)


Debugging memory leak
- check the active requests and active handles for nodejs processes
- active handles are references to an open resource like an opened file,  database connection or a request (what is a more precise definition?)
- when the connection is not closed, active handles count will increase, and we will have memory leak
- to get count, we can use the function process._getActiveHandles() and process._getActiveRequests() respectively
- packages like wtfnode allows us to debug the active handles usage

References:

- https://medium.com/trabe/detecting-node-js-active-handles-with-wtfnode-704e91f2b120
- https://github.com/davidmarkclements/overload-protection


## Debugging active handles

```js
const http = require('http')
const PORT = 8000

const server = http.createServer(function onReq (req, res) {
  setTimeout(function () {
    res.end('hello world')
  }, 10000)
})

server.listen(PORT, function onListen () {
  console.log(`server listening on port ${PORT}`)
})

process.on('SIGUSR1', function onSignal () {
  const activeHandles = process._getActiveHandles()
  const activeHandlesByConstructor = {}

  console.log('Number of active handles:', activeHandles.length)
  activeHandles.forEach(function (activeHandle) {
    if (activeHandlesByConstructor[activeHandle.constructor.name]) {
      ++activeHandlesByConstructor[activeHandle.constructor.name]
    } else {
      activeHandlesByConstructor[activeHandle.constructor.name] = 1
    }
  })
  console.log('Active handles:', activeHandlesByConstructor)
})
```

Make a few requests:
```bash
$ curl localhost:8000
```

Find the process:

```bash
$ ps | grep node
18992 ttys002    0:00.10 node index.js
```

Send a usr1 signal so that we can debug the server without restarting them:
```bash
$ kill -usr1 18992 
```

Output:
```bash
» node index.js
server listening on port 8000
Number of active handles: 3
Active handles: { Server: 1, WriteStream: 2  }
```
