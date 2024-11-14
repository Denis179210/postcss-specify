function isMulti(selector) {
  return selector.split(',').length > 1;
}

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

      root.nodes.forEach((item) => {
        const clone = item.clone();
        if (
            Array.isArray(ignoreTransformationFor) &&
            ignoreTransformationFor.length &&
            item instanceof Rule
        ) {
          if(isMulti(clone.selector)) {
            const multiSelector = clone.selector.split(',');
            const acceptable = [];
            multiSelector.forEach((entryName) => {
              if (ignoreTransformationFor.includes(entryName)) {
                const ignorableClone = clone.clone();
                ignorableClone.selector = entryName;
                ignoreNodes.push(ignorableClone);
              } else {
                acceptable.push(entryName);
              }
            });
            if (acceptable.length) {
              clone.selector = acceptable.join(',');
              acceptNodes.push(clone);
            }
          }
          else if (ignoreTransformationFor.includes(clone.selector)) {
            ignoreNodes.push(clone);
          } else {
            acceptNodes.push(clone);
          }
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
