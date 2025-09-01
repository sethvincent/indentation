import { dedenter } from '../index.js'
import { argv } from './helpers.js'

const regex = {
  // strip variable type annotations and normalize assignment spacing.
  variableType: /\b(const|let|var)\s+([A-Za-z_$][\w$]*)\s*:\s*[^=;,\n]+(?:\s*)=\s*/g,

  // strip function param types.
  functionParamType: /([([,]\s*[A-Za-z_$][\w$]*)(\??)\s*:\s*([^=,)\]]+)/g,

  // strip function return types before an opening brace.
  functionReturnType: /\)\s*:\s*[^({=;\n]+(\s* {)/g,
}

export function stripTypes (parts, ...values) {
  const strings = parts?.raw

  if (!strings || !Array.isArray(strings)) {
    throw new TypeError('js must be called as a tagged template literal')
  }

  return dedenter(strings, values, postprocess)
}

function postprocess (code) {
  let out = code

  out = out.replace(regex.variableType, '$1 $2 = ')
  out = out.replace(regex.functionParamType, '$1')
  out = out.replace(regex.functionReturnType, ')$1')

  return out
}

if (import.meta.url === `file://${argv[1]}`) {
  const result = stripTypes`
    const limit: number = 10

    function add (a: number, b: number): number {
      return a + b
    }
  `

  console.log(result)
}
