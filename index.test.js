const postcss = require('postcss')
const { equal } = require('node:assert')
const { test } = require('node:test')

const plugin = require('./')

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  equal(result.css, output)
  equal(result.warnings().length, 0)
}

const input = '.hello,.hello-again { color: red; .inside { height: 100% } } .world { color: gray } @media screen { .yes { color: blue } }';
const expect = `#app {${input} }`;
// const wrapped = `${}`
test('does something', async () => {
  await run(input, expect, { 'selector': '#app' })
})

