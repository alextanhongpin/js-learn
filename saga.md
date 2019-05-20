## Saga Orchestrator

The goal is to create an orchestrator to manage the sequence of the state and perform commits(moving the state forward) or rollbacks (undoing the commit).

Why not use javascript generator? Cause can't rollback.

```js
class SagaOrchestrator {
  state = 1
  constructor(steps) {
    this.steps = steps
  }
  // Checks if it is possible to transition to the previous step.
  allowPrev(stepId) {
    if ((this.state & (1 << stepId)) === 0) {
      return false
    }
    const state = 1
    for (const step of this.steps) {
      state |= (1 << step.id)
      const isCurr = step.id === stepId
      const noSkip = state === this.state
      if (isCurr && noSkip) {
        return true
      }
    }
    return false
  }
  // Checks if it is possible to transition to the next step.
  allowNext(stepId) {
    const isSet = (this.state & (1 << stepId)) !== 0
    if (isSet) return false

    const inferredState = 1
    for (const step of this.steps) {
      const isCurr = step.id === stepId
      const noSkip = inferredState === this.state
      if (isCurr && noSkip) {
        return true
      }
      inferredState |= (1 << step.id)
    }
    return false
  }
  // Compute the next step.
  next() {
    for (const step of this.steps) {
      if ((this.state & (1 << step.id)) === 0) {
        return step.id
      }
    }
    return -1
  }
  // Methods. Commit forces the state to move forward, while rollback undo it.
  commit(stepId) {
    if (this.allowNext(stepId)) {
      this.state |= (1 << stepId)
    }
  }
  // TODO: Add another compensation method (?)
  rollback(stepId) {
    if (this.allowPrev(stepId)) {
      this.state &= ~(1 << stepId)
      return true
    }
    return false
  }
  // Getters.
  get initial() {
    return this.state === 1
  }
  get completed() {
    const state = 1
    for (const step of this.steps) {
      state |= (1 << step.id)
    }
    return this.state === state
  }

}

const steps = [{
    id: 1,
    event: "checkout"
  },
  {
    id: 2,
    event: "order_made"
  }
]

const saga = new SagaOrchestrator(steps)
console.log(saga.next())
saga.allowNext(1)
saga.commit(1)
console.log(saga.next())
saga.allowNext(2)
saga.completed
saga.commit(2)
console.log(saga.next())
saga.allowNext(3)
saga.completed
console.log(saga.completed)

console.log(saga.allowPrev(2))
console.log(saga.rollback(2))
console.log(saga)

console.log(saga.allowPrev(1))
console.log(saga.rollback(1))
console.log(saga)
console.log(saga.allowPrev(1))
console.log(saga.rollback(1))
console.log(saga.initial)
```

## TODO

- add an event manager to subscribe to the events and delegate the actions upon completion
- add data store to keep track of the states so that it survives restarts
- ensure the steps are idempotent or guarantee once only delivery
- handle success or error scenario by allowing the next commit to proceed or undoing the previous commit.
