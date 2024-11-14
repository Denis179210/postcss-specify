/**
 * @type {import('postcss').PluginCreator}
 */
const {Rule} = require("postcss");
module.exports = (opts = {}) => {
  // Work with options here

  const selector = opts.selector;
  const ignoreTransformationFor = opts.ignore;

  return {
    postcssPlugin: 'postcss-specify',
    Once (root) {
      // console.log(`postcssPlugin "postcss-specify" started modifying node on ${root.nodes} at ${new Date().toISOString()}`);

      if (!selector) {
        console.warn('No specific selector passed! Nothing done!');
        return;
      }

      const ignoreNodes = [];
      const acceptNodes = [];

      root.nodes.forEach((node) => {
        const clone = node.clone();
        if (
            Array.isArray(ignoreTransformationFor) &&
            !!ignoreTransformationFor.length &&
            node instanceof Rule &&
            ignoreTransformationFor.includes(clone.selector)
        ) {
          ignoreNodes.push(clone);
        }
        else {
          acceptNodes.push(clone);
        }

      });

      root.removeAll();

      const specificityNode = new Rule({
        selector: `${selector}`,
        nodes: acceptNodes
      })

      root.append(...ignoreNodes);
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
