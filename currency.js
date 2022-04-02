# Currency

- what library to use
- how to render input? (use two input, type number for editing, and type text for display)


## Dinero.js

Installation:
```
npm i dinero.js
```

Example:

```js
//-- index.js --
const Dinero = require("dinero.js");
const assert = require("assert");

const tests = [
  { amount: 1234, currency: "MYR", expected: "MYR 12.34" },
  // Note that we cannot have more than 2 decimals place.
  // The result won't be 12.345.
  { amount: 12345, currency: "MYR", expected: "MYR 123.45" },
];

for (const test of tests) {
  const { amount, currency, expected } = test;
  const price = Dinero({ amount, currency });
  // Dinero uses char code 160 for spaces, aka '&nbsp;'.
  // This has a different length and fails equality check.
  const formatted = price.toFormat().replace(String.fromCharCode(160), " ");
  assert.deepEqual(formatted, expected);
}
```
