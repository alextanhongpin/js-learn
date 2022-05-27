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


## CSV Validator

Note to self: don't reinvent the field, just use a library for validation.

```js
class ValueError extends Error {
  constructor(key, value, message = "ValueError", options) {
    super(message, options);
    this.name = this.constructor.name;
    this.message = message;
    this.key = key ?? undefined;
    this.value = value ?? undefined; // Ensure the field is always present
  }

  toJSON() {
    return {
      value: this.value,
      key: this.key,
      message: this.message,
      name: this.name,
    };
  }

  toString() {
    return `${this.key}: ${this.message}, got (${this.value})`;
  }
}

function defined(value) {
  return value !== undefined && value !== null;
}

// diff checks if the left root keys and right root keys matches.
function diff(a = {}, b = {}) {
  const lhs = new Set(Object.keys(a));
  const rhs = new Set(Object.keys(b));
  const all = new Set([...lhs, ...rhs]);
  for (const key of all) {
    if (lhs.has(key) && rhs.has(key)) {
      lhs.delete(key);
      rhs.delete(key);
    }
  }

  return {
    match: lhs.size + rhs.size === 0,
    additional: [...lhs],
    missing: [...rhs],
  };
}

class Age {
  static MIN_AGE = 13;
  static MAX_AGE = 200;

  static validate(age) {
    if (isNaN(age)) {
      throw new ValueError("age", age, "invalid");
    }

    if (age < Age.MIN_AGE || age > Age.MAX_AGE) {
      throw new ValueError("age", age, "out of range");
    }
  }
}

try {
  const age = Age.validate(20);
  console.log(age.toString());
  console.log(age);
} catch (error) {
  const newError = new Error("bad request", { cause: error });
  console.log(error instanceof ValueError);
  console.log(newError.cause instanceof ValueError);
}

class Name {
  static validate(name) {
    if (!name) {
      throw new ValueError("name", name, "required");
    }
  }
}

class CsvRowError extends Error {
  constructor(row, options) {
    super("", options);
    this.name = this.constructor.name;
    this.row = row;
  }

  toString() {
    const cause = this.cause;
    if (!cause) {
      throw new Error(
        "CsvRowError: 'cause' cannot be empty: new CSVRowError(row, { cause: error })"
      );
    }

    // The 'cause' is an array of validation errors.
    if (cause instanceof AggregateError) {
      const message = cause.errors.map((error) => error.toString());
      return `row ${this.row} invalid, found ${message.length} error${
        message.length === 1 ? "" : "s"
      } - ${message.join(", ")}`;
    }

    return `row ${this.row} invalid, ${cause}`;
  }
}

class CsvValidator {
  static HEADER_BY_FIELD = {};
  static VALIDATORS = {};
  static MAX_ERRORS = 7;

  static validateProperties() {
    const errors = [];
    const result = diff(this.HEADER_BY_FIELD, this.VALIDATORS);
    if (!result.match) {
      if (result.additional.length) {
        errors.push(
          new Error(
            `CsvValidator: HEADER_BY_FIELD has additional fields (${result.additional.join(
              ", "
            )})`
          )
        );
      }
      if (result.missing.length) {
        errors.push(
          new Error(
            `CsvValidator: HEADER_BY_FIELD has missing fields (${result.missing.join(
              ", "
            )})`
          )
        );
      }
    }

    if (errors.length) {
      throw new AggregateError(errors);
    }
  }

  static validateHeader(currentHeader = []) {
    const current = Object.fromEntries(
      currentHeader.map((header) => [header, true])
    );
    // Check if all header exists.
    const required = Object.fromEntries(
      Object.keys(this.HEADER_BY_FIELD).map((header) => [header, true])
    );

    for (let header in required) {
      if (current[header]) {
        delete current[header];
        delete required[header];
      }
    }
    const missing = Object.keys(required);
    const additional = Object.keys(current);
    if (!missing.length && !additional.length) {
      return;
    }
    const errors = [];
    if (missing.length)
      errors.push(new Error(`missing columns: ${missing.join(", ")}`));
    if (additional.length)
      errors.push(new Error(`additional columns: ${additional.join(", ")}`));
    if (errors.length) {
      throw new AggregateError(errors);
    }
  }

  static validateBody(rows = [], columns = {}) {
    const newRows = [];
    const errors = [];
    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];
        this.validateHeader(Object.keys(row));
        newRows.push(this.validateRow(row, columns));
      } catch (error) {
        errors.push(new CsvRowError(i + 1, { cause: error }));
        if (errors.length >= this.MAX_ERRORS) {
          break;
        }
      }
    }
    if (errors.length) {
      throw new AggregateError(errors);
    }

    return newRows;
  }

  static validateRow(row = {}, columns = {}) {
    const result = {};
    const errors = [];

    for (const col in columns) {
      const { optional, validate, parse } = columns[col];
      const value = parse?.(row[col]) ?? row[col];
      if (optional && !defined(value)) {
        continue;
      }
      if (!optional && !defined(value)) {
        errors.push(new ValueError(col, value, "required"));
        continue;
      }
      try {
        validate?.(value);
      } catch (error) {
        errors.push(error);
      }
      result[col] = value;
    }

    if (errors.length) {
      throw new AggregateError(errors);
    }

    return result;
  }

  static validate(data = []) {
    if (!data.length) {
      return;
    }
    this.validateProperties();
    return this.validateBody(data, this.VALIDATORS);
  }

  toCSV(data = []) {
    throw new Error("not implemented");
  }
  fromCSV(data = "") {
    throw new Error("not implemented");
  }
}

class Married {
  static validate(b) {
    if (b === true || b === false) {
      return;
    }
    throw new ValueError("married", b, "invalid option");
  }

  static parse(b) {
    return ["true", "false"].includes(b) ? JSON.parse(b) : b;
  }
}

class UserCsvValidator extends CsvValidator {
  // The left side is the field, the right side is the CSV column name, which could be different.
  static HEADER_BY_FIELD = {
    name: "name",
    age: "age",
    married: "married",
  };

  static VALIDATORS = {
    age: { optional: false, validate: Age.validate, parse: Number },
    name: { optional: false, validate: Name.validate },
    married: {
      optional: true,
      validate: Married.validate,
      parse: Married.parse,
    },
  };

  static validateRow(row = {}, columns = {}) {
    const newRow = super.validateRow(row, columns);

    // Sometimes we want to be able to perform validation on multiple columns.
    const { married, age } = newRow;
    if (married && age < 17) {
      throw new Error("invalid legal married age");
    }
    console.log("validating row", newRow);
    return newRow;
  }
}

// Assumed that all parsed CSV fields are string.
const rows = [
  { age: "13", name: "john", married: "true" },
  { age: "1", name: "", married: "false" },
  {},
  { age: "non-legal-age" },
  { married: "yes" },
  { age: "non-legal-age", name: "", married: "yes" },
];

try {
  const result = UserCsvValidator.validate(rows);
  console.log("got result");
  console.table(result);
} catch (error) {
  if (error instanceof AggregateError) {
    console.log(
      `Found ${error.errors.length} error(s) out of ${rows.length} row(s)`
    );
    const pretty = error.errors.map((error) => error.toString());
    console.log(pretty);
  } else {
    console.log(error);
  }
}
```


## Papaparse

```js
const headers = {
  CourseId: "courseId",
  CourseTitle: "courseTitle",
  DurationInSeconds: "durationInSeconds",
  ReleaseDate: "releaseDate",
  Description: "description",
  AssessmentStatus: "assessmentStatus",
  IsCourseRetired: "isCourseRetired",
};

let count = 1;
Papa.parse(file, {
  header: true,
  skipEmptyLines: true,
  transformHeader: (header) => {
    return headers[header] ?? header;
  },
  // Transform is field level.
  transform: (value, key) => {
    if (key === "isCourseRetired") {
      return value === "yes";
    }
    return value;
  },
  step: (result, parser) => {
    count++;
    if (count > 5) {
      parser.abort();
    }
  },
  complete: ({ data, errors, meta }) => {
    console.log("completed", { data });
  },
});
```
