import test from 'brittle'
import { js } from '../../examples/js.js'

test('js - basic usage', (t) => {
  const result = js`
    function hello() {
      console.log('world')
    }
  `

  t.is(result, 'function hello() {\n  console.log(\'world\')\n}')
})

test('js - with interpolation', (t) => {
  {
    const name = 'greet'
    const message = 'Hello, World!'

    const result = js`
      function ${name}() {
        console.log('${message}')
      }
    `

    t.is(result, 'function greet() {\n  console.log(\'Hello, World!\')\n}')
  }

  {
    const property = 'data'
    const method = property.charAt(0).toUpperCase() + property.slice(1)
    const result = js`
      class Example {
        async get${method}() {
          return this.${property}
        }
      }
    `

    t.ok(result.includes('async getData() {'))
    t.ok(result.includes('  return this.data'))
  }
})

test('js - removes extra blank lines', (t) => {
  const result = js`
    function test() {


      return true
    }
  `

  t.is(result, 'function test() {\n\n  return true\n}')
})

test('js - validation errors', (t) => {
  t.exception.all(() => {
    js(null)
  }, /js must be called as a tagged template literal/)

  t.exception.all(() => {
    js('direct string')
  }, /js must be called as a tagged template literal/)
})
