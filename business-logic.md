## Place business logic in their own dedicated class.

For forms etc in React/Vue, consolidate business logic in their own classes/or static functions for more functional approach. This ensure that the logics are not cluttered and can be reused easily. Relevant fields can be grouped together for validation too. This will keep the component and reducers free from business logic and promotes code reusability.

```js
class Note {
  constructor(value) {
    this.value = Note.validate(value)
  }
  static validate(value) {
    const {
      text = ''
    } = value
    if (!text.trim().length) throw new Error('text is required')
    return value
  }
  static from(json) {
    return new Note(json)
  }
}

// const note = Note.from({text: '    '})
// console.log(note.value)

const note = Note.validate({
  text: '   '
})
console.log(note)
```
