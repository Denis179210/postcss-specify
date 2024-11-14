const postcss = require('postcss')
const { equal } = require('node:assert')
const { test } = require('node:test')

const plugin = require('./')

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  equal(result.css, output)
  equal(result.warnings().length, 0)
}

test('Specifies all rules', async () => {
  const input = '.hello,.hello-again { color: red; .inside { height: 100% } } .world { color: gray } @media screen { .yes { color: blue } }';
  const expect = `#app {${input} }`;
  await run(input, expect, { 'selector': '#app' })
});


test('Specifies all rules except ignore list', async () => {
  const input = 'html { font-size: 16px } .hello,.hello-again { color: red; .inside { height: 100% } } .world { color: gray } @media screen { .yes { color: blue } }';
  const expect = `html { font-size: 16px } #app { .hello,.hello-again { color: red; .inside { height: 100% } } .world { color: gray } @media screen { .yes { color: blue } } }`;
  await run(input, expect, { 'selector': '#app', 'ignore': ['html', 'body', ':before'] })
});


test('Does nothing because of selector argument absence', async () => {
  const input = '.hello,.hello-again { color: red; .inside { height: 100% } } .world { color: gray } @media screen { .yes { color: blue } }';
  const expect = `${input}`;
  await run(input, expect);
});

test('Specifies all rules except ignore list and extracts ignorable selector names from multi-selectors', async () => {
  const input = 'html,body,div { font-size: 16px } .hello,.hello-again { color: red; .inside { height: 100% } } .world { color: gray } @media screen { .yes { color: blue } }';
  const expect = `html { font-size: 16px }body { font-size: 16px }#app {div { font-size: 16px } .hello,.hello-again { color: red; .inside { height: 100% } } .world { color: gray } @media screen { .yes { color: blue } } }`;
  await run(input, expect, { 'selector': '#app', 'ignore': ['html', 'body', ':before'] })
});


test('Keeps original indents and spaces', async () => {
  const input = `
    .hello,.hello-again {
      color: red;
      .inside {
        height: 100%
      }
    }
  `;
  const expect = `#app {
    .hello,.hello-again {
      color: red;
      .inside {
        height: 100%
      }
    }
}
  `;
  await run(input, expect, { 'selector': '#app', 'ignore': ['html', 'body', ':before'] })
});

test('Ignores pseudo elements and pseudo classes', async () => {
  const input = `::after {content: '*'; display: block} div {color: red}`;
  const expect = `::after {content: '*'; display: block} #app { div {color: red}}`;
  await run(input, expect, { 'selector': '#app', 'ignore': ['html', 'body', ':host', '::before', '::after'] })
});



