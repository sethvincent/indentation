import test from 'brittle'
import {
  dedent,
  dedentStrings,
  getIndent,
  getIndentLengths,
  indentLines,
  interpolate,
  onlyWhitespace,
  regex,
} from '../index.js'

test('dedent - basics', (t) => {
  {
    const result = dedent`
      Hello
      World
    `

    t.is(result, 'Hello\nWorld')
  }

  {
    const result = dedent`Hello
      World
    `

    t.is(result, 'Hello\nWorld')
  }

  {
    const result = dedent`{}`
    t.is(result, '{}')
  }

  {
    const result = dedent`const message = {
      ok: '${'cool'}'
    }`

    t.is(result, 'const message = {\n  ok: \'cool\'\n}')
  }
})

test('dedent - nested dedent', (t) => {
  {
    const result = dedent`
      Hello
      ${dedent`
        Cruel
      `}
      World
    `

    t.is(result, 'Hello\nCruel\nWorld')
  }

  {
    const result = dedent`
      Hello
        ${dedent`
          Cruel
        `}
      World
    `

    t.is(result, 'Hello\n  Cruel\nWorld')
  }

  {
    const cruel = dedent`
      Cruel
    `

    const result = dedent`
      Hello
      ${cruel}
      World
    `

    t.is(result, 'Hello\nCruel\nWorld')
  }

  {
    const cruel = dedent`
      Cruel
    `

    const result = dedent`
      Hello
        ${cruel}
      World
    `

    t.is(result, 'Hello\n  Cruel\nWorld')
  }
})

test('dedent - empty input', (t) => {
  t.is(dedent``, '')
  t.is(dedent`${null}`, '')
  t.is(dedent`${undefined}`, '')
})

test('dedent - simple inputs', (t) => {
  t.is(dedent`ok`, 'ok')
  t.is(dedent`hi ${'ok'}`, 'hi ok')
})

test('dedent - escape sequences', (t) => {
  t.is(dedent`\${'nice'}`, '${\'nice\'}')
  t.is(dedent`hi: \`ok\``, 'hi: `ok`')
})

test('dedent - objects indented correctly', (t) => {
  t.is(
    dedent`{
      example: ${{ message: 'hi' }}
    }`,
    '{\n  example: {\n    "message": "hi"\n  }\n}',
  )
})

test('dedent - validation errors', (t) => {
  t.exception.all(() => {
    dedent(null)
  }, /dedent must be called as a tagged template literal/)

  t.exception.all(() => {
    dedent('direct string')
  }, /dedent must be called as a tagged template literal/)

  t.exception.all(() => {
    dedent(['array', 'of', 'strings'])
  }, /dedent must be called as a tagged template literal/)
})

test('regex - all patterns', (t) => {
  t.ok(regex.newlineWithIndent instanceof RegExp)
  t.ok(regex.closingIndentation instanceof RegExp)
  t.ok(regex.newline instanceof RegExp)
  t.ok(regex.firstLineIndent instanceof RegExp)
  t.ok(regex.startsWithNewline instanceof RegExp)

  t.is(regex.newlineWithIndent.source, '\\n([ \\t]*)')
  t.ok(regex.newlineWithIndent.global)

  t.is(regex.closingIndentation.source, '(?:^|\\n)([ \\t]*)$')

  t.is(regex.newline.source, '\\r?\\n|\\r')
  t.ok(regex.newline.global)

  t.is(regex.firstLineIndent.source, '^([ \\t]*)')

  t.is(regex.startsWithNewline.source, '^[\\r\\n]')

  t.ok(Object.isFrozen(regex))
})

test('onlyWhitespace', (t) => {
  t.not(onlyWhitespace('   ', 0))
  t.ok(onlyWhitespace('   ', 3))
  t.ok(onlyWhitespace('   \n', 3))
  t.ok(onlyWhitespace('   \r\n', 3))
  t.ok(onlyWhitespace('hello\n', 5))

  t.not(onlyWhitespace('   hello', 3))
  t.not(onlyWhitespace('hello', 0))
  t.not(onlyWhitespace('   hello\n', 3))
})

test('getIndent', (t) => {
  t.is(getIndent('no indent'), '')
  t.is(getIndent('\n  indented'), '  ')
  t.is(getIndent('\n\tindented'), '\t')
  t.is(getIndent('first line\n    second line'), '    ')
  t.is(getIndent('first\nsecond\n      third'), '')
})

test('indentLines', (t) => {
  t.is(indentLines('single line', '  '), 'single line')
  t.is(indentLines('line1\nline2', '  '), 'line1\n  line2')
  t.is(indentLines('line1\nline2\nline3', '\t'), 'line1\n\tline2\n\tline3')
  t.is(indentLines('', '  '), '')
  t.is(indentLines('\n\n', '  '), '\n  \n  ')
})

test('indentLines - with firstLine option', (t) => {
  t.is(indentLines('single line', '  ', { firstLine: true }), '  single line')
  t.is(indentLines('line1\nline2', '  ', { firstLine: true }), '  line1\n  line2')
  t.is(indentLines('line1\nline2\nline3', '\t', { firstLine: true }), '\tline1\n\tline2\n\tline3')
  t.is(indentLines('', '  ', { firstLine: true }), '  ')
  t.is(indentLines('\n\n', '  ', { firstLine: true }), '  \n  \n  ')

  // Test default behavior (firstLine: false)
  t.is(indentLines('line1\nline2', '  ', { firstLine: false }), 'line1\n  line2')
  t.is(indentLines('line1\nline2', '  ', {}), 'line1\n  line2')
})

test('getIndentLengths', (t) => {
  t.alike(getIndentLengths(['no indent']), [])
  t.alike(getIndentLengths(['  indented']), [2])
  t.alike(getIndentLengths(['\t\ttabbed']), [2])
  t.alike(getIndentLengths(['  \n']), [])
  t.alike(getIndentLengths(['line1\n  line2']), [2])
  t.alike(getIndentLengths(['line1\n  line2\n    line3']), [2, 4])
  t.alike(getIndentLengths(['  first\n    second', '\n      third']), [2, 4, 6])
  t.alike(getIndentLengths(['\n  \n    content']), [4])
})

test('dedentStrings', (t) => {
  const strings1 = ['  hello\n  world']
  const lengths1 = [2]
  t.alike(dedentStrings(strings1, lengths1), ['hello\nworld'])

  const strings2 = ['    hello', '\n    world']
  const lengths2 = [4, 4]
  t.alike(dedentStrings(strings2, lengths2), ['hello', '\nworld'])

  const strings3 = ['no indent']
  const lengths3 = []
  t.alike(dedentStrings(strings3, lengths3), ['no indent'])

  const strings4 = ['  hello\n    nested\n  back']
  const lengths4 = [2, 4, 2]
  t.alike(dedentStrings(strings4, lengths4), ['hello\n  nested\nback'])

  const strings5 = ['\\$escaped\\`backtick']
  const lengths5 = []
  t.alike(dedentStrings(strings5, lengths5), ['$escaped`backtick'])
})

test('interpolate', (t) => {
  const strings1 = ['Hello ', '!']
  const values1 = ['World']
  const lengths1 = []
  t.is(interpolate(strings1, values1, lengths1), 'Hello World!')

  const strings2 = ['Value: ', '']
  const values2 = [42]
  const lengths2 = []
  t.is(interpolate(strings2, values2, lengths2), 'Value: 42')

  const strings3 = ['Object:\n  ', '']
  const values3 = [{ key: 'value' }]
  const lengths3 = [2]
  t.is(interpolate(strings3, values3, lengths3), 'Object:\n  {\n    "key": "value"\n  }')

  const strings4 = ['Null: ', '\nUndefined: ', '\nFunction: ', '']
  const values4 = [null, undefined, () => {}]
  const lengths4 = []
  t.is(interpolate(strings4, values4, lengths4), 'Null: \nUndefined: \nFunction: ')

  const strings5 = ['Multi\n  ', '\n  line']
  const values5 = ['line1\nline2']
  const lengths5 = [2]
  t.is(interpolate(strings5, values5, lengths5), 'Multi\n  line1\n  line2\n  line')

  const strings6 = ['Boolean: ', '\nNumber: ', '']
  const values6 = [true, 3.14]
  const lengths6 = []
  t.is(interpolate(strings6, values6, lengths6), 'Boolean: true\nNumber: 3.14')
})
