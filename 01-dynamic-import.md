
## With node.js

```js
function generateDynamicCodeUrl(value) {
  const moduleStr = `export const result = ${value} * 2;`;
  return `data:text/javascript,${encodeURIComponent(moduleStr)}`;
}

const url = generateDynamicCodeUrl(21);
const { result } = await import(url);

console.log(result); // -> 42
```

## With Deno
```js
const scriptContent = `export function greet() { return "Hello from dynamic script!"; }`;

// Create a temporary file
const tmpFilePath = await Deno.makeTempFile({ suffix: ".ts" });
await Deno.writeTextFile(tmpFilePath, scriptContent);

// Dynamically import the temporary file using the 'file://' scheme
const dynamicModule = await import(`file://${tmpFilePath}`);

console.log(dynamicModule.greet());
```
