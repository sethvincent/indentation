import { dedenter } from '../index.js'

export function js (parts, ...values) {
  const strings = parts?.raw

  if (!strings || !Array.isArray(strings)) {
    throw new TypeError('js must be called as a tagged template literal')
  }

  return dedenter(strings, values, postprocess)
}

function postprocess (code) {
  const lines = code.split('\n').map((line) => line.trimEnd())

  return lines
    .reduce((acc, line, i, arr) => {
      if (line === '' && i > 0 && arr[i - 1] === '') {
        return acc
      }
      acc.push(line)
      return acc
    }, [])
    .join('\n')
}

if (import.meta.url === `file://${Bare.argv[1]}`) {
  const className = 'UserService'
  const methods = ['create', 'update', 'delete']

  const result = js`
    export class ${className} {
      constructor(db) {
        this.db = db
      }

      ${
    methods.map((method) =>
      js`async ${method}(data) {
          return this.db.${method}('users', data)
        }`
    ).join('\n\n')
  }

      async validate(data) {
        if (!data.email) {
          throw new Error('Email is required')
        }

        return true
      }
    }
  `

  console.log(result)
}
