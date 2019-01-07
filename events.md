# Decoupling with Observer pattern

```js
class OldPurchaseService {
  purchase() {
    const item = {}
    // This step is coupled to the purchase service, even when the logic is not exactly 
    // related. This gets messy real-quick when the implementation grows.
    this.sendEmail(item)
  }
  sendEmail(item: any) {
    // Send an email.
  }
}
interface Observer {
  emit(key: string): void
  on(key: string, ...args: any[]): void
}
class PurchaseService {
  constructor(private o: Observer) {}
  purchase() {
    // Some implementation detailts...
    const item = {}
    this.o.emit('purchase', item)
  }
}
// The difference between the old and new purchase service is a new observer is passed down 
// through dependency injection, and we decoupled the sending email logic.The email client 
// can now stay at the top level(outside) of the PurchaseService, thus decoupling the dependencies.
const purchaseService = new PurchaseService(new Observer())
purchaseService.on('purchase', (item: any) => {
  // Send an email.
})
```
