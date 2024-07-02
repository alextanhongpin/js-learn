# Loading pattern for `transformer.js`

```js
function delay(duration = 1000) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

class Singleton {
  constructor() {
    this.status = null;
    this.error = null;
    this.queue = [];
  }

  async send(input) {
    switch (this.status) {
      case "success":
        return `hi, ${input}`;
      case "pending":
        this.queue = [input];
      case null:
        this.status = "pending";
        this.queue = [input];
        // Load the model.
        try {
          await delay(5000);
          this.status = "success";
        } catch (error) {
          this.status = "failed";
          this.error = error;
        } finally {
          return this.queue.length && this.send(this.queue.pop());
        }
      case "failed":
        throw this.error;
    }
  }
}

let instance;

self.onmessage = async (e) => {
  console.log("received test worker", e);
  instance ??= new Singleton();
  // When triggered multiple times, it will only process
  // the last message after it has loaded.
  // Other messages will be discarded.
  // After that, all messages will be processed.
  const msg = await instance.send(e.data);
  msg && self.postMessage(msg);
};
```
