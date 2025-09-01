import test from 'brittle'
import { stripTypes } from '../../examples/strip-types.js'

test('strip-types - strips simple type annotations', (t) => {
  const result = stripTypes`
    const limit: number = 10

    function add (a: number, b: number): number {
      return a + b
    }
  `

  t.is(
    result,
    'const limit = 10\n\nfunction add (a, b) {\n  return a + b\n}',
  )
})

test('strip-types - with interpolation', (t) => {
  const name = 'greet'
  const param = 'subject'
  const paramType = 'string'
  const returnType = 'string'
  const messageStart = 'Hello, '
  const messageEnd = '!'

  const result = stripTypes`
      function ${name}(${param}: ${paramType}): ${returnType} {
        return \`${messageStart}\${${param}}${messageEnd}\`
      }
    `

  t.is(result, 'function greet(subject) {\n  return `Hello, ${subject}!`\n}')
})
