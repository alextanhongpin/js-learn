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
  if (!country.trim().length) {
    throw new Error('invalid country')
  }
  return {
    country,
    flightTickets: [], // From db.
    lastLocations: ['area52'] // From db.
  }
}

async function ruleParser(entity) {
  // Convert an entity to facts first. In this case, we have person as an entity,
  // and we want to get the facts about the legal age based on the country he is in.
  const facts = await entityToFacts(entity)
  const hasFlightTickets = facts.flightTickets.length > 0
  const hasVisitedLocation = facts.lastLocations.includes(facts.country)
  const isSuspiciousLogin = !hasFlightTickets && !hasVisitedLocation
  if (isSuspiciousLogin) throw new Error('suspicious login ' + entity.ip)
  return entity
}

ruleParser(new Person('john', '0.0.0.0')).then((entity) => console.log(entity)).catch(console.error)
ruleParser(new Person('john', '0.0.0.1')).then(console.log).catch(console.error)
```

## Serializable rules
https://www.npmjs.com/package/json-rules-engine
```js
function rule(value, operator, fact) {
  switch (operator) {
    case 'eq':
      return value === fact
    case 'neq':
      return value !== fact
    case 'gt':
      return value > fact
    case 'gte':
      return value >= fact
    case 'lt':
      return value < fact
    case 'lte':
      return value <= fact
    default:
      throw new Error('unknown rule')
  }
}

// The rule can be loaded from db. The value can be obtained during runtime

const rules = [{
  name: 'age must be greater than min age',
  operator: 'gte',
  fact: 15,
  value: function(person) {
    return person.age
  }
}]

const person = {
  age: 5
}
for (const r of rules) {
  if (!rule(r.value(person), r.operator, r.fact)) {
    throw new Error(`${r.name}: age is ${r.value(person)}`)
  }
}
```
