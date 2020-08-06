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
    if (this.minDate && this.startDate < this.minDate) {
      throw new Error(`startDate must be after ${this.minDate}`)
    }
    if (this.endDate && this.maxDate && this.endDate > this.maxDate) {
      throw new Error(`endDate must be before ${this.maxDate}`)
    }
    if !(this.allowedDays.includes(this.start)) {
      throw new Error('startDate must be in allowedDays')
    }
    if !(this.allowedDays.includes(this.end)) {
      throw new Error('endDate must be in allowedDays')
    }
    if (this.deniedDays.includes(this.start)) {
      throw new Error('startDate must not be in deniedDays')
    }
    if (this.deniedDays.includes(this.end)) {
      throw new Error('endDate must not be in deniedDays')
    }
    if (this.skipWeekends) {
      if (isWeekend(this.start)) throw new Error("startDate must not be weekend")
      if (isWeekend(this.end)) throw new Error("endDate must not be weekend")
    }
    if (this.publicHolidays.includes(this.start)) {
      throw new Error('startDate must not be in publicHolidays')
    }
    if (this.publicHolidays.includes(this.end)) {
      throw new Error('endDate must not be in publicHolidays')
    }
    if (this.organizerCalender.includes(this.start) || this.organizerCalendar.includes(this.end)) {
      throw new Error('organizer date is booked in this period')
    }
  }
  // How to handle calendar in different timezone?
  // TODO: Add validation in setter.
  // set endDate (value) {
  // this.computeEndDate(value)
  // }

  get end() {
    if (this.isFullDay) {
      return this.endDate ?
        endOfDay(this.endDate) :
        endOfDay(this.startDate)
    }
    if (this.endDate) return this.endDate
    if (this.period) return this.startDate + this.period
    throw new Error("unable to compute end, one of isFullDay, endDate of period must be provided")
  }
  get start() {
    return this.isFullDay ?
      startOfDay(this.startDate) :
      this.startDate
  }
}
```
