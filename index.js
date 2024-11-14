/**
 * @type {import('postcss').PluginCreator}
 */
const {Rule} = require("postcss");
module.exports = (opts = {}) => {
  // Work with options here

  const specify = opts.selector;

  return {
    postcssPlugin: 'postcss-specify',
    Once (root) {
      // console.log(`postcssPlugin "postcss-specify" started modifying node on ${root.nodes} at ${new Date().toISOString()}`);
      const cloneRootNodes = root.nodes.map(node => node.clone());
      root.removeAll();
      const specificityNode = new Rule({
        selector: `${specify}`,
        nodes: cloneRootNodes
      })
      root.append(specificityNode);
      // console.log(`postcssPlugin "postcss-specify": Success!`);
    }

    /*
    OnceExit(root) {
      const result = root.toResult();
      console.log(`Result`, result);
    }
    */

    /*
    Root (root, postcss) {
      // Transform CSS AST here
    },
    */

    /*
    Declaration (decl, postcss) {
      // The faster way to find Declaration node
    }
    */

    /*
    Declaration: {
      color: (decl, postcss) {
        // The fastest way find Declaration node if you know property name
      }
    }
    */
  }
}

module.exports.postcss = true
