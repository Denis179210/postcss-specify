const postcss = require('postcss')
const { equal } = require('node:assert')
const { test } = require('node:test')

const plugin = require('./')

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  equal(result.css, output)
  equal(result.warnings().length, 0)
}

const input1 = '.hello,.hello-again { color: red; .inside { height: 100% } } .world { color: gray } @media screen { .yes { color: blue } }';
const expect1 = `#app {${input1} }`;

test('Specifies all rules', async () => {
  await run(input1, expect1, { 'selector': '#app' })
});


const input2 = 'html { font-size: 16px } .hello,.hello-again { color: red; .inside { height: 100% } } .world { color: gray } @media screen { .yes { color: blue } }';
const expect2 = `html { font-size: 16px } #app { .hello,.hello-again { color: red; .inside { height: 100% } } .world { color: gray } @media screen { .yes { color: blue } } }`;

test('Specifies all rules except ignore list', async () => {
  await run(input2, expect2, { 'selector': '#app', 'ignore': ['html', 'body', ':before'] })
});


const input3 = '.hello,.hello-again { color: red; .inside { height: 100% } } .world { color: gray } @media screen { .yes { color: blue } }';
const expect3 = `${input3}`;

test('Does nothing because of selector argument absence', async () => {
  await run(input3, expect3);
});



