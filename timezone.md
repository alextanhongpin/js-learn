## Best practices

- post dates to REST API (or graphql, anything that is sent to the server) as RFC3339. It is based on ISO8601, so it should be interchangeable
- return date as UTC so that client can perform the conversion

## Issue with UTC conversion.

If the user can purchase an item only after 12:00 A.M. SGT, then the server should validate it correctly.
Given the following timezone:

```
1545148800000 is 19 Dec 12:00AM
```

- client must now send RFC3339 (not ISO8601) datetime with timezone info (e.g. moment().format() by default formats the date to RFC3339)
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


## Angle between hour and minute hand

```js
// Calculate the degree between hours and seconds, say 3:27.
const HOUR_HAND = 0.5
const MINUTE_HAND = 6

function hourHandAngle(hours, minutes = 0) {
  return ((hours % 12) * 60 + minutes % 60) * HOUR_HAND
}

function minuteHandAngle(minutes = 0) {
  return minutes % 60 * MINUTE_HAND
}

function angleBetween(hours, minutes = 0) {
  const angle = Math.abs(hourHandAngle(hours, minutes) - minuteHandAngle(minutes))
  return Math.min(360 - angle, angle)
}

// angleBetween(9, 60) // 90
// angleBetween(3, 30) // 75
angleBetween(3, 27) // 58.5
```

## Hour and Minute Hand of a clock meeting

When are the hour and minute hands of a clock superimposed?
```js  
// (H * 60 + M) * 0.5 = 6 * M
// 60H + M = 12M
// M = 60 / 11 H

H is an integer in the range 0–11. This gives times of: 0:00, 1:05.45, 2:10.90, 3:16.36, 4:21.81, 5:27.27. 6:32.72, 7:38.18, 8:43.63, 9:49.09, 10:54.54, and 12:00. (0.45 minutes are exactly 27.27 seconds.)
```

## Initialize JS Date to a particular timezone

```js
function changeTimezone(date, ianatz) {
  // Suppose the date is 12:00 UTC.
  const invdate = new Date(date.toLocaleString('en-US', {
    timeZone: ianatz
  }))
  
  // Then invdate will be 07:00 in Toronto,
  // and the diff is 5 hours.
  const diff = date.getTime() - invdate.getTime()
  
  // So 12:00 in Toronto is 17:00 UTC.
  return new Date(date.getTime() + diff)
}

// Malaysia is +8, Toronto is -4, total difference is 12 hours.
const there = new Date('Thu, 06 Aug 2020 12:00:00 GMT')
const here = changeTimezone(there, 'America/Toronto')
there + ' ' + here
```


## References

- https://date-fns.org/v2.15.0/docs/Time-Zones
