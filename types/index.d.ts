/**
 * Tagged template literal function that removes common leading whitespace
 * @param {TemplateStringsArray} parts - Template string parts
 * @param {...*} values - Interpolated values
 * @returns {string} Dedented string
 * @throws {TypeError} If not called as a tagged template literal
 */
export function dedent (parts: TemplateStringsArray, ...values: any[]): string
/**
 * Main dedent processing function
 * @param {string[]} strings - Template string parts
 * @param {*[]} [values=[]] - Interpolated values
 * @param {(result: string) => string} [postprocess=(result) => (result?.trim())] - Post-processing function
 * @returns {string} Processed and dedented string
 */
export function dedenter (strings: string[], values?: any[], postprocess?: (result: string) => string): string
/**
 * Remove common indentation from string parts
 * @param {string[]} strings - Template string parts
 * @param {number[]} indentLengths - Array of indentation lengths to determine minimum
 * @returns {string[]} Dedented string parts
 */
export function dedentStrings (strings: string[], indentLengths: number[]): string[]
/**
 * Check if the remainder of a string contains only whitespace
 * @param {string} string - String to check
 * @param {number} afterIndentPos - Position to start checking from
 * @returns {boolean} True if only whitespace remains
 */
export function onlyWhitespace (string: string, afterIndentPos: number): boolean
/**
 * Calculate indentation lengths from template strings
 * @param {string[]} strings - Template string parts
 * @returns {number[]} Array of indentation lengths
 */
export function getIndentLengths (strings: string[]): number[]
/**
 * Interpolate values into dedented strings with proper indentation
 * @param {string[]} strings - Dedented string parts
 * @param {*[]} values - Values to interpolate
 * @returns {string} Final interpolated string
 */
export function interpolate (strings: string[], values: any[]): string
/**
 * Extract indentation from a string
 * @param {string} string - String to extract indentation from
 * @returns {string} Indentation characters
 */
export function getIndent (string: string): string
/**
 * Add indentation to each line of text
 * @param {string} text - Text to indent
 * @param {string} indentation - Indentation to add
 * @param {Object} [options={}] - Options for indentation
 * @param {boolean} [options.firstLine=false] - Whether to indent the first line
 * @returns {string} Indented text
 */
export function indentLines (text: string, indentation: string, options?: {
  firstLine?: boolean
}): string
/**
 * Regular expressions used throughout the dedent process
 * @property {RegExp} newlineWithIndent - Matches newlines followed by indentation
 * @property {RegExp} closingIndentation - Matches indentation at the end of a line or string
 * @property {RegExp} newline - Matches various newline characters
 * @property {RegExp} firstLineIndent - Matches indentation at the beginning of a string
 * @property {RegExp} startsWithNewline - Matches strings that start with newline characters
 */
export const regex: Readonly<{
  newlineWithIndent: RegExp
  closingIndentation: RegExp
  newline: RegExp
  firstLineIndent: RegExp
  startsWithNewline: RegExp
}>
