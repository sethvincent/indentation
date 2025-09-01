/**
 * Regular expressions used throughout the dedent process
 * @property {RegExp} newlineWithIndent - Matches newlines followed by indentation
 * @property {RegExp} closingIndentation - Matches indentation at the end of a line or string
 * @property {RegExp} newline - Matches various newline characters
 * @property {RegExp} firstLineIndent - Matches indentation at the beginning of a string
 * @property {RegExp} startsWithNewline - Matches strings that start with newline characters
 */
export const regex = Object.freeze({
  newlineWithIndent: /\n([ \t]*)/g,
  closingIndentation: /(?:^|\n)([ \t]*)$/,
  newline: /\r?\n|\r/g,
  firstLineIndent: /^([ \t]*)/,
  startsWithNewline: /^[\r\n]/,
})

/**
 * Tagged template literal function that removes common leading whitespace
 * @param {TemplateStringsArray} parts - Template string parts
 * @param {...*} values - Interpolated values
 * @returns {string} Dedented string
 * @throws {TypeError} If not called as a tagged template literal
 */
export function dedent (parts, ...values) {
  const strings = parts?.raw

  if (!strings || !Array.isArray(strings)) {
    throw new TypeError('dedent must be called as a tagged template literal')
  }

  return dedenter(strings, values)
}

/**
 * Main dedent processing function
 * @param {string[]} strings - Template string parts
 * @param {*[]} [values=[]] - Interpolated values
 * @param {(result: string) => string} [postprocess=(result) => (result?.trim())] - Post-processing function
 * @returns {string} Processed and dedented string
 */
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

/**
 * Remove common indentation from string parts
 * @param {string[]} strings - Template string parts
 * @param {number[]} indentLengths - Array of indentation lengths to determine minimum
 * @returns {string[]} Dedented string parts
 */
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

/**
 * Check if the remainder of a string contains only whitespace
 * @param {string} string - String to check
 * @param {number} afterIndentPos - Position to start checking from
 * @returns {boolean} True if only whitespace remains
 */
export function onlyWhitespace (string, afterIndentPos) {
  const restOfLine = string.substring(afterIndentPos)
  return !restOfLine || regex.startsWithNewline.test(restOfLine)
}

/**
 * Calculate indentation lengths from template strings
 * @param {string[]} strings - Template string parts
 * @returns {number[]} Array of indentation lengths
 */
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

/**
 * Interpolate values into dedented strings with proper indentation
 * @param {string[]} strings - Dedented string parts
 * @param {*[]} values - Values to interpolate
 * @returns {string} Final interpolated string
 */
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

/**
 * Extract indentation from a string
 * @param {string} string - String to extract indentation from
 * @returns {string} Indentation characters
 */
export function getIndent (string) {
  const match = string.match(regex.newlineWithIndent)
  return match ? match[0].replace(regex.newline, '') : ''
}

/**
 * Add indentation to each line of text
 * @param {string} text - Text to indent
 * @param {string} indentation - Indentation to add
 * @param {Object} [options={}] - Options for indentation
 * @param {boolean} [options.firstLine=false] - Whether to indent the first line
 * @returns {string} Indented text
 */
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
