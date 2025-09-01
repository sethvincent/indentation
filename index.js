export const regex = Object.freeze({
  newlineWithIndent: /\n([ \t]*)/g,
  closingIndentation: /(?:^|\n)([ \t]*)$/,
  newline: /\r?\n|\r/g,
  firstLineIndent: /^([ \t]*)/,
  startsWithNewline: /^[\r\n]/,
})

export function dedent (parts, ...values) {
  const strings = parts?.raw

  if (!strings || !Array.isArray(strings)) {
    throw new TypeError('dedent must be called as a tagged template literal')
  }

  return dedenter(strings, values)
}

export function dedenter (
  strings,
  values = [],
  postprocess = (result) => (result?.trim()),
) {
  const indentLengths = getIndentLengths(strings)
  const dedented = dedentStrings(strings, indentLengths)
  const result = interpolate(dedented, values, indentLengths)
  return postprocess(result)?.trim()
}

export function dedentStrings (strings, indentLengths) {
  const minIndent = indentLengths.length > 0 ? Math.min(...indentLengths) : 0
  const dedentRegex = new RegExp(`\n[ \t]{${minIndent}}`, 'g')
  const dedented = []

  for (let [index, string] of strings.entries()) {
    string = handleEscapeSequences(string)

    if (index === 0 && minIndent > 0) {
      const firstLine = string.match(regex.firstLineIndent)

      if (firstLine && firstLine[0].length >= minIndent) {
        string = string.substring(minIndent)
      }
    }

    dedented.push(string.replace(dedentRegex, '\n'))
  }

  return dedented
}

export function onlyWhitespace (string, afterIndentPos) {
  const restOfLine = string.substring(afterIndentPos)
  return !restOfLine || regex.startsWithNewline.test(restOfLine)
}

export function getIndentLengths (strings) {
  const lengths = []

  const match = strings?.[0]?.match(regex.firstLineIndent)
  const indent = match?.[0] || ''

  if (indent.length && !onlyWhitespace(strings[0], indent.length)) {
    lengths.push(indent.length)
  }

  for (const string of strings) {
    for (const match of string.matchAll(regex.newlineWithIndent)) {
      if (!onlyWhitespace(string, match.index + match[0].length)) {
        lengths.push(match[1].length)
      }
    }
  }

  return lengths
}

export function interpolate (strings, values) {
  const parts = []
  let currentLine = ''

  for (const [index, string] of strings.entries()) {
    parts.push(string)

    const lastNewline = string.lastIndexOf('\n')
    currentLine = lastNewline >= 0 ? string.slice(lastNewline) : currentLine + string

    if (index >= values.length) {
      continue
    }

    const value = values[index]
    const current = parts.join('')
    const indentationMatch = current.match(regex.closingIndentation)
    let indentation = indentationMatch ? indentationMatch[1] : ''

    if (!indentation.length) {
      indentation = getIndent(currentLine)
    }

    let indentedValue
    switch (typeof value) {
      case 'undefined':
      case 'function': {
        indentedValue = ''
        break
      }

      case 'string': {
        if (!value.includes('\n')) {
          indentedValue = value
          break
        }

        indentedValue = indentLines(value, indentation)
        break
      }

      case 'object': {
        if (value === null) {
          indentedValue = ''
          break
        }

        indentedValue = indentLines(
          JSON.stringify(value, null, indentation.length || 2),
          indentation,
        )

        break
      }

      default: {
        indentedValue = String(value)
      }
    }

    parts.push(indentedValue)
  }

  return parts.join('')
}

export function getIndent (string) {
  const match = string.match(regex.newlineWithIndent)
  return match ? match[0].replace(regex.newline, '') : ''
}

export function indentLines (text, indentation, options = {}) {
  const { firstLine = false } = options

  return text
    .split('\n')
    .map((line, index) => {
      return (index === 0 && !firstLine) ? line : indentation + line
    })
    .join('\n')
}

function handleEscapeSequences (string) {
  return string
    .replace(/\\\$/g, '$')
    .replace(/\\`/g, '`')
}
