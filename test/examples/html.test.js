import test from 'brittle'
import { html } from '../../examples/html.js'

test('html - basic template', (t) => {
  const result = html`
    <div>
      <p>Hello World</p>
    </div>
  `

  t.is(result, '<div>\n  <p>Hello World</p>\n</div>')
})

test('html - with interpolated values', (t) => {
  const title = 'My Title'
  const content = 'Some content here'

  const result = html`
    <article>
      <h1>${title}</h1>
      <p>${content}</p>
    </article>
  `

  t.is(
    result,
    '<article>\n'
      + '  <h1>My Title</h1>\n'
      + '  <p>Some content here</p>\n'
      + '</article>',
  )
})

test('html - escapes HTML entities', (t) => {
  const dangerous = '<script>alert("XSS")</script>'
  const withQuotes = 'Text with "quotes" and \'apostrophes\''

  const result = html`
    <div>
      <p>${dangerous}</p>
      <span>${withQuotes}</span>
    </div>
  `

  t.ok(result.includes('&lt;script&gt;'))
  t.ok(result.includes('&quot;quotes&quot;'))
  t.ok(result.includes('&#39;apostrophes&#39;'))
})

test('html - validation errors', (t) => {
  t.exception.all(() => {
    html(null)
  }, /html must be called as a tagged template literal/)

  t.exception.all(() => {
    html('direct string')
  }, /html must be called as a tagged template literal/)
})
