
## Input type number remove trailing zeros
```js
value == ‘0’ ? ‘’ : value
```

Why not `Number(value).toString()`?
This will remove end zeros too for decimals / floats, will be weird if we are inputting amount for expenses etc.


