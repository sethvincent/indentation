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

Objects are pretty-printed with current indent:

```js
import { dedent } from 'indentation'

const data = { a: 1, b: { c: 2 } }

console.log(dedent`
  const data = ${data}
`)

// data:
//   {
//     "a": 1,
//     "b": {
//       "c": 2
//     }
//   }
```

Indent the first line of a string:

```js
import { indentLines } from 'indentation'

console.log(indentLines('x\ny', '  '))
// x
//   y

console.log(indentLines('x\ny', '  ', { firstLine: true }))
//   x
//   y
```

Build your own tag with `dedenter`:

```js
import { dedenter } from 'indentation'

function upper (parts, ...values) {
  const strings = parts.raw

  // result is the full dedented and interpolated string
  function postprocess (result) {
    return result.toUpperCase().trim()
  }

  return dedenter(strings, values, postprocess)
}

console.log(upper`
  this is
      some text
  cool
    right?
`)
```

The `dedenter` function composes the `getIndentLengths`, `dedentStrings`, and `interpolate` functions. You can create a similar composition of those functions that better fits your use case if needed.

```js
export function dedenter (
  strings,
  values = [],
  postprocess = (result) => (result?.trim()),
) {
  const indentLengths = getIndentLengths(strings)
  const dedented = dedentStrings(strings, indentLengths)
  const result = interpolate(dedented, values)
  return postprocess(result)?.trim()
}
```

## Examples

See the [`examples/`](examples/) directory for helpers built on `dedenter`.

## License

Apache-2.0
