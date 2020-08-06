## Appointment Class
```js
// Appointment is a class to manage and check appointment dates.
// It should be able to compute the start/end date of the appointment
// based on the criteria provided, and check if the appointment is valid.
// TODO: Store timestamps for easier calculation (?)
// - but how about timezone?
class Appointment {
  constructor({
    startDate,
    endDate,
    minDate,
    maxDate,
    period = '30m',
    isFullDay = false,
    publicHolidays = [],
    skipWeekends = true,
    deniedDays = [],
    allowedDays = []
  }) {
    if (!startDate) {
      throw new Error('startDate is required')
    }
    if (!isValidDate(startDate)) {
      throw new Error('startDate is invalid')
    }
    if (endDate && !(isValidDate(endDate))) {
      throw new Error('endDate is invalid')
    }
    if !((isFullDay || endDate || period)) {
      throw new Error("one of isFullDay, endDate of period must be provided")
    }
    this.startDate = startDate
    this.endDate = endDate
    this.minDate = minDate
    this.maxDate = maxDate
    this.period = period
    this.isFullDay = isFullDay
    this.publicHolidays = publicHolidays
    this.skipWeekends = skipWeekends
    this.deniedDays = deniedDays
    this.allowedDays = allowedDays
  }

  validate(organizerCalendar = []) {
    const start = this.#computeStart()
    const end = this.#computeEnd()
    if (!isValidDate(start)) throw new Error('startDate is invalid')
    if (!isValidDate(end)) throw new Error('endDate is invalid')
    if (this.minDate && start < this.minDate) {
      throw new Error(`startDate must be after ${this.minDate}`)
    }
    if (this.maxDate && endDate > this.maxDate) {
      throw new Error(`endDate must be before ${this.maxDate}`)
    }
    if !(this.allowedDays.includes(start)) {
      throw new Error('startDate must be in allowedDays')
    }
    if !(this.allowedDays.includes(end)) {
      throw new Error('endDate must be in allowedDays')
    }
    if (this.deniedDays.includes(start)) {
      throw new Error('startDate must not be in deniedDays')
    }
    if (this.deniedDays.includes(end)) {
      throw new Error('endDate must not be in deniedDays')
    }
    if (this.skipWeekends) {
      if (isWeekend(start)) throw new Error("startDate must not be weekend")
      if (isWeekend(end)) throw new Error("endDate must not be weekend")
    }
    if (this.publicHolidays.includes(start)) {
      throw new Error('startDate must not be in publicHolidays')
    }
    if (this.publicHolidays.includes(end)) {
      throw new Error('endDate must not be in publicHolidays')
    }
    if (this.organizerCalender.includes(start) || this.organizerCalendar.includes(end)) {
      throw new Error('organizer date is booked in this period')
    }
  }

  // How to handle calendar in different timezone?
  // TODO: Add validation in setter.
  // set endDate (value) {
  // this.computeEndDate(value)
  // }
  #computeEnd() {
    if (this.isFullDay) {
      return this.endDate ?
        endOfDay(this.endDate) :
        endOfDay(this.startDate)
    }
    if (this.endDate) return this.endDate
    if (this.period) return this.startDate + this.period
    throw new Error("unable to compute end, one of isFullDay, endDate of period must be provided")
  }
  #computeStart() {
    return this.isFullDay ?
      startOfDay(this.startDate) :
      this.startDate
  }
}
```
