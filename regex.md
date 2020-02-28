```js
Regexp


{
  // Positive Lookahead only matches if it ends with
  const re = /Year(?= (?<year>[\d]+))/g

  console.log(...'Year 2020'.matchAll(re))
  // This will consume the regex.
  // console.log('lookeahead', re.exec('Year 2020'))
  console.log(...'Year 11hello'.matchAll(re))
  console.log(...'Year 2020'.matchAll(re))
} {
  // Negative Lookahead only matches if it does not end with
  const re = /Red(?!Green)/g
  console.log(...'RedGreen'.matchAll(re))
  console.log(...'RedBlue'.matchAll(re))
}

{

  // Positive Lookbehind only matches if it begins with...
  const re = /(?<=\$)(\d+)/g
  console.log(...'$1000'.matchAll(re))
  console.log(...'1000'.matchAll(re))
}

{
  console.log('look behind')
  // Negative Lookbehind only matches if it does not begin with...
  const re = /(?<!\d{3}) meters/g
  console.log(...'10 meters'.matchAll(re))
  console.log(...'1000 meters'.matchAll(re))
}

{
  const text = `rgb(0, 10, 128)`
  const re = /rgb\((?<red>[\d]+),\s?(?<green>[\d]+),\s?(?<blue>[\d]+)\)/ig

  const matches = Array.from(text.matchAll(re))[0]
  // This can only be used once.
  // const matches = re.exec(text)
  console.log(matches.groups.red)
  console.log(matches.groups.green)
  console.log(matches.groups.blue)
}

{
  const date = `2012-01-02`
  const re = /(?<year>\d{4})-(?<month>\d{2})-(?<date>\d{2})/
  console.log(re.exec(date))
}

{
  const text = 'War & Peace'
  console.log(text.replace(/(War) & (Peace)/g, '$2 & $1'))
  console.log(text.replace(/(?<War>War) & (?<Peace>Peace)/g, '$2 & $1'))
}
```
