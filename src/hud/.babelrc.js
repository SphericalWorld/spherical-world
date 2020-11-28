const config = require('../../.babelrc.js');

module.exports = (api) => {
  api.cache(true);

  return {
    ...config,
    plugins: config.plugins.filter(
      el => el !== './common/ecs/utils/babelPlugin.js' &&
      el !== '@babel/plugin-transform-react-jsx'
    ).concat([["@babel/plugin-transform-react-jsx", {
      "runtime": "automatic"
    }]])
  };
};
