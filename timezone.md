
## Issue with UTC conversion.

If the user can purchase an item only after 12:00 A.M. SGT, then the server should validate it correctly.
Given the following timezone:

```
1545148800000 is 19 Dec 12:00AM
```

- client must now send ISO8601 datetime with timezone info (e.g. new Date().toISOString())
- date range calculation will be done on the client side with the local timezone, but validated on server side
- 1 day: means same date, just send startDate = endDate, e.g. start 2018-01-19, end 2018-01-19, server will set the startDate to 00:00:00 and endDate to 23:59:59
- 2 days: means two date, e.g. 2018-01-19 to 2018-01-20
- hours, minutes and seconds do not matter, but will still be kept at the server side
- datetime is stored as utc in the database
- if timezone info is required, create a new column with `varchar(32)` to keep the timezone

Test Cases:
```js
const moment = require('moment')

describe('story: timezone is killing me', () => {
  describe('scenario: user purchase an item at SGT time at 12:00 a.m.', () => {
    const state = {}
    const startTimestamp = 1545148800000
    test('given that the user purchase an item at 12:00 a.m. on the 19th December', () => {
      const startDate = new Date(startTimestamp)
      expect(startDate.getDate()).toBe(19)
      expect(startDate.getHours()).toBe(0)
      expect(startDate.getMinutes()).toBe(0)
      expect(moment(startDate).format()).toBe('2018-12-19T00:00:00+08:00')
    })

    test('then the start date in UTC should be 8 hours behind', () => {
      const startDate = moment(startTimestamp).utc()
      expect(startDate.hour()).toBe(16)
      expect(startDate.minute()).toBe(0)
      expect(startDate.date()).toBe(18) // The previous day.
      expect(startDate.clone().format()).toBe('2018-12-18T16:00:00Z')
      expect(moment(startTimestamp).utcOffset()).toBe(480)
    })

    test('then the start and end date should be computed in UTC', () => {
      const offsetHours = moment.parseZone(startTimestamp).utcOffset()
      const startDate = moment
        .utc(startTimestamp)
        .utcOffset(offsetHours, true)
        .add(offsetHours, 'm')
        .startOf('day')

      const startDateTz = startDate.clone()
      const startDateUtc = startDate.clone().utc()
      expect(startDateTz.format()).toBe('2018-12-19T00:00:00+08:00')
      expect(startDateUtc.format()).toBe('2018-12-18T16:00:00Z')

      const endDate = startDate.clone().endOf('day')
      const endDateTz = endDate.clone()
      const endDateUtc = endDate.clone().utc()
      expect(endDateTz.format()).toBe('2018-12-19T23:59:59+08:00')
      expect(endDateUtc.format()).toBe('2018-12-19T15:59:59Z')
    })
  })
})
```
