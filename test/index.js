runTests()

async function runTests () {
  const test = (await import('brittle')).default

  test.pause()

  await import('./dedent.test.js')
  await import('./examples/html.test.js')
  await import('./examples/js.test.js')
  await import('./examples/md.test.js')

  test.resume()
}
