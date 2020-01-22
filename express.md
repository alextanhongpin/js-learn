## Setting timeout in Express

Setting timeout in server is important so that the server do not "hang". The default timeout is 2 minutes, but sometimes there are timeouts configured on the load balancer (nginx etc) that is shorter (60seconds) that might throw a different error. So it is better to handle it on the server side.

You may set the timeout either globally for entire server:
```js
var server = app.listen();
server.setTimeout(500000);
```
or just for specific route:

```js
app.post('/xxx', function (req, res) {
   req.setTimeout(500000);
});
```

## For http servers


```js
var server = http.createServer(app);
/**
* Listen on provided port, on all network interfaces
*/
server.listen(port);
server.timeout=yourValueInMillisecond
```
