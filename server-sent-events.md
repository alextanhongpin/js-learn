## Server-sent-events

Express Server:
```js
import express from "express";
import SSE from "express-sse";
import cors from "cors";

const sse = new SSE(["hello", "world"]);

const app = express();
app.use(cors());
app.get("/events", sse.init);
app.get("/health", (req, res) => {
  res.status(200).json({
    ok: true
  });
});

app.listen(8080, () => {
  console.log("listening to port *:8080");
});
```

Client:

```js
const eventSource = new EventSource("//127.0.0.1:8080/events", {
  withCredentials: false
});
```
