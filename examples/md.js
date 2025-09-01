import { dedenter } from '../index.js'

export function md (parts, ...values) {
  const strings = parts?.raw

  if (!strings || !Array.isArray(strings)) {
    throw new TypeError('md must be called as a tagged template literal')
  }

  const processedValues = values.map((value, index) => {
    if (typeof value === 'string') {
      return escapeMarkdown(value)
    }

    return value
  })

  return dedenter(strings, processedValues)
}

function escapeMarkdown (str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/`/g, '\\`')
    .replace(/#/g, '\\#')
}

if (import.meta.url === `file://${Bare.argv[1]}`) {
  const baseUrl = 'http://localhost:3000'

  const result = md`
    # API Documentation

    ## Overview

    > This API follows REST conventions and returns JSON responses.
    > All endpoints require authentication.

    ## Endpoints

    - \`GET /users\` - List all users
    - \`POST /users\` - Create a new user
    - \`PUT /users/:id\` - Update a user
    - \`DELETE /users/:id\` - Delete a user

    ## Code Examples

    ### JavaScript

    \`\`\`javascript
      fetch('${baseUrl}/api/users')
        .then(response => response.json())
        .then(users => {
          console.log('Users:', users)
        })
    \`\`\`

    ### cURL

    \`\`\`
    curl -X GET ${baseUrl}/api/users \\
      -H "Authorization: Bearer TOKEN"
    \`\`\`

    ## Notes

    Rate limiting applies: 100 requests per minute.

    \`\`\`bash
    # Check rate limit status
    curl -I ${baseUrl}/api/users
    \`\`\`
  `

  console.log(result)
}
