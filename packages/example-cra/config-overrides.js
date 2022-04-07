const {
  override,
  addWebpackPlugin,
  addWebpackResolve,
  removeModuleScopePlugin,
} = require("customize-cra");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = override(
  addWebpackPlugin(new NodePolyfillPlugin()),
  addWebpackResolve({
    fallback: {
      fs: false,
    },
  }),
  removeModuleScopePlugin()
);
