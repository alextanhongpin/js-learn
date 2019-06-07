```js
// https://www.movable-type.co.uk/scripts/latlong.html
class Point {
  constructor(value) {
    this.value = value
  }
  toRadians() {
    return this.value * Math.PI / 180
  }
}

class Latitude extends Point {
  constructor(value) {
    if (value < -90 || value > 90) {
      throw new Error('invalid latitude')
    }
    super(value)
  }
}

class Longitude extends Point {
  constructor(value) {
    if (value < -180 || value > 180) {
      throw new Error('invalid longitude')
    }
    super(value)
  }
}
const point = new Longitude(1)
alert(point.toRadians())

const EARTH_RADIUS_IN_METER = 6371e3

class Position {
  constructor(lat, lon) {
    if (!(lat instanceof Latitude)) {
      throw new Error('type must be latitude')
    }
    if (!(lon instanceof Longitude)) {
      throw new Error('type must be longitude')
    }
    this.lat = lat
    this.lon = lon
  }
  // Distance returned is in meter.
  distance(position) {
    if (!(position instanceof Position)) {
      throw new Error('type must be position')
    }
    const {
      lat,
      lon
    } = position
    const [lat1, lon1, lat2, lon2] = [this.lat, this.lon, lat, lon].map(p => p.toRadians())
    const deltaLat = lat2 - lat1
    const deltaLon = lon2 - lon1
    const a = Math.pow(Math.sin(deltaLat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return EARTH_RADIUS_IN_METER * c
  }
}

const [lat1, lon1] = [new Latitude(32.0004311), new Longitude(-103.548851)]
const [lat2, lon2] = [new Latitude(33.374939), new Longitude(-103.6041946)]
const p1 = new Position(lat1, lon1)
const p2 = new Position(lat2, lon2)
alert(p1.distance(p2))
// 152926.02752348033 meter
```
