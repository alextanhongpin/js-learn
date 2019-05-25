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
  const lastLocations = ['area52']
  return {
    country,
    hasPurchasedFlightTicket: false, // From db.
    isNewLocation: !lastLocations.includes(country) // From db.
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

function hasLoggedInFromDifferentLocation(entity, facts) {
  if (facts.isNewLocation && !facts.hasPurchasedFlightTicket) {
    throw new Error('suspicious login')
  }
}

async function ruleParser(entity) {
  // Convert an entity to facts first. In this case, we have person as an entity,
  // and we want to get the facts about the legal age based on the country he is in.
  const facts = await entityToFacts(entity)
  console.log(facts)

  // Facts cannot be fiction.
  validateFacts(facts)
  hasLoggedInFromDifferentLocation(entity, facts)
}

ruleParser(new Person('john', '0.0.0.0')).then(console.log).catch(console.error)
```
