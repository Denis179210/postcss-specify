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
  const input1 = '.hello,.hello-again { color: red; .inside { height: 100% } } .world { color: gray } @media screen { .yes { color: blue } }';
  const expect1 = `#app {${input1} }`;
  await run(input1, expect1, { 'selector': '#app' })
});


test('Specifies all rules except ignore list', async () => {
  const input2 = 'html { font-size: 16px } .hello,.hello-again { color: red; .inside { height: 100% } } .world { color: gray } @media screen { .yes { color: blue } }';
  const expect2 = `html { font-size: 16px } #app { .hello,.hello-again { color: red; .inside { height: 100% } } .world { color: gray } @media screen { .yes { color: blue } } }`;
  await run(input2, expect2, { 'selector': '#app', 'ignore': ['html', 'body', ':before'] })
});


const input3 = '.hello,.hello-again { color: red; .inside { height: 100% } } .world { color: gray } @media screen { .yes { color: blue } }';
const expect3 = `${input3}`;

test('Does nothing because of selector argument absence', async () => {
  await run(input3, expect3);
});

test('Specifies all rules except ignore list and extracts ignorable selector names from multi-selectors', async () => {
  const input4 = 'html,body,div { font-size: 16px } .hello,.hello-again { color: red; .inside { height: 100% } } .world { color: gray } @media screen { .yes { color: blue } }';
  const expect4 = `html { font-size: 16px }body { font-size: 16px }#app {div { font-size: 16px } .hello,.hello-again { color: red; .inside { height: 100% } } .world { color: gray } @media screen { .yes { color: blue } } }`;
  await run(input4, expect4, { 'selector': '#app', 'ignore': ['html', 'body', ':before'] })
});


test('Keeps original indents and spaces', async () => {
  const input5 = `
    .hello,.hello-again {
      color: red;
      .inside {
        height: 100%
      }
    }
  `;
  const expect5 = `#app {
    .hello,.hello-again {
      color: red;
      .inside {
        height: 100%
      }
    }
}
  `;
  await run(input5, expect5, { 'selector': '#app', 'ignore': ['html', 'body', ':before'] })
});



