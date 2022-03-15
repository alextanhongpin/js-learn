# Checking for required columns CSV

```js
// Dummy CSV Parser ... use a more robust one to split by ", " in quotes.
function parseCSV(input: string) {
  return input.split("\n").map((line) => line.split(","));
}

function requiredProperties(obj) {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      throw new Error(`missing property: ${key}`);
    }
  }
}

class CSVParser {
  constructor(mappings) {
    for (const mapping of mappings) {
      requiredProperties({
        name: mapping.name,
        key: mapping.key,
        required: mapping.required,
      });
    }
    this.mappings = mappings;
  }

  parse(input) {
    const table = parseCSV(input);
    if (!table) return [];

    const [header, ...body] = table;

    this.validateHeaderAndBodyColumnLengthMatches(header, body);
    this.validateRequiredColumnsPresent(header, body);

    const keys = this.transformHeader(header);
    return this.transformRows(body, keys);
  }

  // If the header can be mapped, return the key.
  // Otherwise, return undefined.
  transformHeader(header = []) {
    return header
      .map((label) => this.mappings.find((column) => column.name === label))
      .map((column) => column && column.key);
  }

  // Maps each row which is an array of data into an array of key-value pairs.
  transformRows(body = [], keys = []) {
    return body.map((row, n) => {
      const data = row
        .map((col, i) => [keys[i], col])
        .filter((tuple) => tuple[0] !== undefined);
      return Object.fromEntries(data);
    });
  }

  // Checks if all required columns are present.
  validateRequiredColumnsPresent(header, body) {
    const missingColumns = this.mappings.filter(
      (column) => column.required && !header.includes(column.name)
    );
    if (missingColumns.length) {
      throw new Error(`Missing columns: ${missingColumns.join(",")}`);
    }
  }

  // Checks if the body has the same columns as the header.
  // Fails on first mismatch.
  validateHeaderAndBodyColumnLengthMatches(header = [], body = []) {
    let nrow = 1; // Header counts as first row.
    for (const row of body) {
      nrow++;
      const diff = header.length - row.length;
      if (diff === 0) {
        continue;
      }
      // Header has more columns than row. The last nth columns must be missing.
      if (diff > 0) {
        throw new Error(
          `row ${nrow}: missing columns ${header.slice(-diff).join(", ")}`
        );
      }
      // Row has more columns than header.
      if (diff < 0) {
        throw new Error(
          `row ${nrow}: too many columns present: ${row.join(", ")}`
        );
      }
    }
  }
}

const mappings = [
  { key: "id", name: "Id", required: true },
  { key: "name", name: "Name", required: true },
  { key: "age", name: "Age", required: false },
];
const input = `Id,Name,Age,Test
1,john,10,
2,jane,190,`;

const parser = new CSVParser(mappings);
console.log(parser.parse(input));
// Note that the transformation of data into domain objects (age to number) is not part of the csv parser's responsibility.

```
