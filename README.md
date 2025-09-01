# indentation

dedent with tagged template literal and small helpers.

## Install
```
npm install indentation
```

## Usage
```js
import { dedent } from 'indentation'

const msg = dedent`
  Hello
    World
`

console.log(msg)
// Hello
//   World
```

Interpolate values and keep indentation:
```js

const result = dedent`{
  a: 1
}`

const property = dedent`
  result: ${result}
`

const object = dedent`{
  ${property}
}`

const array = dedent`[
  ${object}
]`

console.log(array)
// [
//   {
//     result: {
//       a: 1
//     }
//   }
// ]


// Other popular dedent libraries will typically output something like this:
//
// [
// {
// result: {
// a: 1
// }
// }
// ]
```

## API
- `dedent\`...\``: tagged template that trims common leading indentation and indents interpolated values.
- `indentLines(text, indentation, { firstLine })`: indent text by a prefix.

See `examples/` for `html`, `js`, and `md` helpers built on `dedenter`.

## License
Apache-2.0
