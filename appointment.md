## Appointment Class
```js
function isValidDate(date) {
  return date instanceof Date && !isNaN(date)
}

function isWeekend() {
  return false
}

function startOfDay(date) {
  if (!isValidDate(date)) throw new Error('startOfDayError: date is invalid')
  return new Date(date).setHours(0, 0, 0, 0)
}

function endOfDay(date) {
  if (!isValidDate(date)) throw new Error('endOfDayError: date is invalid')
  return new Date(date).setHours(23, 59, 59, 999)
}
// Appointment is a class to manage and check appointment dates.
// It should be able to compute the start/end date of the appointment
// based on the criteria provided, and check if the appointment is valid.
// TODO: Store timestamps for easier calculation (?)
// - but how about timezone?
class Appointment {
  #startDate
  #endDate
  constructor({
    startDate,
    endDate,
    minDate,
    maxDate,
    period,
    isFullDay = false,
    publicHolidays = [],
    skipWeekends = true,
    deniedDays = [],
    allowedDays = []
  }) {
    this.#startDate = startDate
    this.#endDate = endDate
    this.minDate = minDate
    this.maxDate = maxDate
    this.period = period
    this.isFullDay = isFullDay
    this.publicHolidays = publicHolidays
    this.skipWeekends = skipWeekends
    this.deniedDays = deniedDays
    this.allowedDays = allowedDays

    this.validateAndReject()
  }
  validateAndReject() {
    const errors = this.validate()
    const messages = Object.values(errors).filter(Boolean)
    if (messages.length) throw new Error(messages.join('\n'))
  }
  validate() {
    const start = this.startDate
    const end = this.endDate
    
    const {
      minDate,
      maxDate,
      deniedDays,
      skipWeekends,
      allowedDays,
      publicHolidays
    } = this
    
    const validations = {
      startDate: [
        !start && 'startDate is required',
        !isValidDate(start) && 'startDate is invalid',
        start > end && 'startDate must be less than endDate',
        minDate && start < minDate && 'startDate cannot be less than minDate'
      ],
      endDate: [
        !end && 'endDate is required',
        !isValidDate(end) && 'endDate is invalid',
        maxDate && end > maxDate && 'endDate cannot be greater than maxDate'
      ],
      minDate: minDate && [
        maxDate && minDate > maxDate && 'minDate cannot be greater than maxDate'
      ],
      deniedDays: deniedDays?.length && [
        deniedDays.includes(start) && 'deniedDays includes startDate',
        deniedDays.includes(end) && 'deniedDays includes endDate',
      ],
      allowedDays: allowedDays?.length ? [
        !Array.isArray(allowedDays) && 'allowedDays is not an array',
        !allowedDays.includes(start) && 'allowedDays does not include startDate',
        !allowedDays.includes(end) && 'allowedDays does not include endDate',
      ],
      skipWeekends: skipWeekends && [
        isWeekend(start) && 'startDate must not be weekend',
        isWeekend(end) && 'endDate must not be weekend'
      ],
      publicHolidays: publicHolidays?.length && [
        publicHolidays.includes(start) && 'publicHolidays includes startDate',
        publicHolidays.includes(end) && 'publicHolidays includes endDate'
      ]
    }
    
    const errors = {}
    for (let field in validations) {
      errors[field] = validations[field].find(Boolean)
    }
    
    return errors
  }

  overlaps(appointment) {
    // After and before...
    return (this.startDate > appointment.endDate && this.endDate > appointment.startDate) ||
      (appointment.startDate > this.endDate && appointment.endDate > this.startDate)
  }

  // How to handle calendar in different timezone?
  // TODO: Add validation in setter.
  // set endDate (value) {
  // this.computeEndDate(value)
  // }
  get endDate() {
    const {
      isFullDay,
      period
    } = this
    if (isFullDay) {
      return this.#endDate ?
        endOfDay(this.#endDate) :
        endOfDay(this.#startDate)
    }
    if (this.#endDate) return this.#endDate
    if (period) return this.#startDate + period
    throw new Error("unable to compute endDate, one of isFullDay, endDate or period must be provided")
  }
  get startDate() {
    const {
      isFullDay,
    } = this
    return isFullDay ?
      startOfDay(this.#startDate) :
      this.#startDate
  }
}

const appointment = new Appointment({
  startDate: new Date(),
  endDate: new Date(),
  allowedDays: [new Date()]
})
console.log(appointment.validate())
```
