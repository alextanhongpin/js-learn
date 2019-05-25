## Legal Drinking Age
```js
class Person {
  constructor(name, age, location) {
    this.name = name
    this.age = age
    this.location = location

  }
}

const ageByLocation = {
  us: 20
}

function entityToFacts(entity) {
  const location = entity.location.trim().toLowerCase()
  return {
    location,
    legalAge: ageByLocation[location]
  }
}

function validateFacts(facts) {
  const {
    location,
    legalAge
  } = facts
  if (!location.length) {
    throw new Error('invalid locatin')
  }
  if (legalAge <= 0 || legalAge > 150) {
    throw new Error('invalid age range')
  }
}

function validDrinkingAgeRule(entity, facts) {
  if (entity.age < facts.legalAge) {
    throw new Error('invalid age')
  }
}

function ruleParser(entity) {
  // Convert an entity to facts first. In this case, we have person as an entity,
  // and we want to get the facts about the legal age based on the country he is in.
  const facts = entityToFacts(entity)

  // Facts cannot be fiction.
  validateFacts(facts)
  validDrinkingAgeRule(entity, facts)
}

ruleParser(new Person('john', 17, 'us'))
```


## Login from different location

```js
class Person {
  constructor(name, ip) {
    this.name = name
    this.ip = ip
  }
}

const ipToCountry = {
  '0.0.0.0': 'area51',
  '0.0.0.1': 'area52'
}

async function entityToFacts(entity) {
  const country = ipToCountry[entity.ip] || ''
  return {
    country,
    flightTickets: [], // From db.
    lastLocations: ['area52'] // From db.
  }
}

function validateFacts(facts) {
  const {
    country
  } = facts
  if (!country.trim().length) {
    throw new Error('invalid country')
  }
}

function hasPurchasedFlightTicket(entity, facts) {
  return {
    value: facts.flightTickets.length > 0,
    rule: 'has flight tickets',
    reason: `flight_ticket count is ${facts.flightTickets.length}`
  }
}

function hasVisitedLocation(entity, facts) {
  return {
    value: facts.lastLocations.includes(facts.country),
    rule: 'has visited location',
    reason: `${facts.lastLocations.join(',')} does not include ${facts.country}`
  }
}

function all(name, ...conditions) {
  for (const cond of conditions) {
    if (!cond.value) {
      throw new Error(`${name} rule: ${cond.rule}: ${cond.reason}`)
      break
    }
  }
}

function not(condition) {
  return {
    ...condition,
    value: !condition.value
  }
}

async function ruleParser(entity) {
  // Convert an entity to facts first. In this case, we have person as an entity,
  // and we want to get the facts about the legal age based on the country he is in.
  const facts = await entityToFacts(entity)
  // Facts cannot be fiction.
  validateFacts(facts)
  all('is suspicious login', not(hasPurchasedFlightTicket(entity, facts)), hasVisitedLocation(entity, facts))
  return entity
}
ruleParser(new Person('john', '0.0.0.0')).then((entity) => console.log(entity)).catch(console.error)
ruleParser(new Person('john', '0.0.0.1')).then(console.log).catch(console.error)
```
