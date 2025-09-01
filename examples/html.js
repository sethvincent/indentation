import { dedenter } from '../index.js'
import { argv } from './helpers.js'

export function html (parts, ...values) {
  const strings = parts?.raw

  if (!strings || !Array.isArray(strings)) {
    throw new TypeError('html must be called as a tagged template literal')
  }

  const processedValues = values.map((value) => {
    if (typeof value === 'string') {
      return escapeHtml(value)
    }

    return value
  })

  return dedenter(strings, processedValues)
}

function escapeHtml (str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

if (import.meta.url === `file://${argv[1]}`) {
  const greeting = 'Hello, World!'

  const result = html`
    <div class="container">
      <h1>${greeting}</h1>
      <p>Welcome to our site</p>
    </div>
  `

  console.log(result)
}
