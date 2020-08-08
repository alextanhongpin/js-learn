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

Others:
- using jsonschema
- using class-validator (typescript)
