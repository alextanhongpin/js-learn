## Exploring different validation approach

Using array of functions:

```js
class Appointment {
  #invariants = []
  constructor({
    startDate,
    endDate
  } = {}) {
    this.startDate = startDate
    this.endDate = endDate

    // Or rules...order is important!
    this.#invariants = [{
        message: 'start date is required',
        valid: () => !!this.startDate
      },
      {
        message: 'start date should be less than end',
        valid: () => this.startDate < this.endDate
      }
    ]
  }
  get valid() {
    for (const invariant of this.#invariants) {
      if (!invariant.valid()) {
        return false
      }
    }
    return true
  }
  validate() {
    for (const invariant of this.#invariants) {
      if (!invariant.valid()) {
        throw new Error(invariant.message)
      }
    }
  }
}


try {
  const appointment = new Appointment({
    startDate: new Date(2020, 1, 2),
    endDate: new Date(2020, 1, 1)
  })
  appointment.validate()
} catch (error) {
  console.log(error)
}

try {
  const appointment = new Appointment()
  appointment.validate()
} catch (error) {
  console.log(error)
}
```

Using Formik style validation:


```js
function isDate(date) {
  return date instanceof Date && !isNaN(date)
}

function validate({
  startDate,
  endDate
}) {
  const errors = {}

  if (!!startDate) {
    errors.startDate = 'startDate is required'
  } else if (!isDate(startDate)) {
    errors.startDate = 'startDate is not a valid Date object'
  } else if (startDate > endDate) {
    errors.startDate = 'startDate must be less than endDate)
  }

  return errors
}

class Appointment {
  constructor({
    startDate,
    endDate
  }) {
    this.startDate
    this.endDate
    validate(this)
  }
}
```

Using AggregateError:

```js
// Fake the AggregateError, until it is available
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError
class AggregateError {
  constructor(errors = [], msg = 'AggregateError') {
    this.errors = errors
    this.message = msg
    this.name = 'AggregateError'
  }
  toString() {
    return this.errors.map(err => err.message).join('\n')
  }
}
class Appointment {
  constructor({
    startDate,
    endDate
  } = {}) {
    this.startDate = startDate
    this.endDate = endDate
  }
  get valid() {
    return !Object.values(this.validate()).some(Boolean)
  }
  validate() {
    // Or rules...order is important!
    const validations = {
      startDate: [
        !this.startDate && 'startDate is required',
        this.startDate > this.endDate && 'startDate must be less than endDate'
      ]
    }
    const errors = {}
    for (const field in validations) {
      const message = validations[field].find(Boolean)
      if (message) errors[field] = message
    }
    return errors
  }
  validateAndReject() {
    if (!this.valid) throw new AggregateError(Object.values(this.validate()).map(msg => new Error(msg)))
  }
}


try {
  const appointment = new Appointment({
    startDate: new Date(2020, 1, 2),
    endDate: new Date(2020, 1, 1)
  })
  console.log(appointment.validate())
  appointment.validateAndReject()
} catch (error) {
  console.log(error)
}

try {
  const appointment = new Appointment()
  console.log(appointment.validate())
  appointment.validateAndReject()
} catch (error) {
  console.log(error)
}

try {
  const appointment = new Appointment({
    startDate: new Date(2020, 1, 1),
    endDate: new Date(2020, 1, 2)
  })
  console.log(appointment.validate())
  appointment.validateAndReject()
  console.log('appointment valid')
} catch (error) {
  console.log(error)
}
```

Others:
- using jsonschema
- using class-validator (typescript)


## Basic type validation

```js
function isDate(unknown) {
  return unknown instanceof Date && !isNaN(unknown)
}

function isArray(unknown) {
  return Array.isArray(unknown)
}

function isObject(unknown) {
  return unknown === Object(unknown) && !isArray(unknown)
}
```
