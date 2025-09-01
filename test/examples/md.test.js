import test from 'brittle'
import { md } from '../../examples/md.js'

test('md - basic template', (t) => {
  const result = md`
    # Title

    Some content here.
  `

  t.is(result, '# Title\n\nSome content here.')
})

test('md - with interpolated values', (t) => {
  const title = 'My Project'
  const version = '1.0.0'

  const result = md`
    # ${title}

    Version: ${version}
  `

  t.is(result, '# My Project\n\nVersion: 1.0.0')
})

test('md - escapes markdown characters', (t) => {
  const text = 'This has *bold* and _italic_ and `code`'

  const result = md`
    Content: ${text}
  `

  t.ok(result.includes('\\*bold\\*'))
  t.ok(result.includes('\\_italic\\_'))
  t.ok(result.includes('\\`code\\`'))
})

test('validation errors', (t) => {
  t.exception.all(() => {
    md(null)
  }, /md must be called as a tagged template literal/)
})
