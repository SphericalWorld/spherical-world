const { injectBabelPlugin, getBabelLoader } = require('react-app-rewired');

module.exports = function override(config, env) {
  // console.log(getBabelLoader(config.module.rules).options)
  getBabelLoader(config.module.rules).options.babelrc = true;
  getBabelLoader(config.module.rules).options.presets = [];
  // throw 1;
  config = injectBabelPlugin('babel-plugin-transform-decorators-legacy', config);
  config = injectBabelPlugin('transform-do-expressions', config);

  config.module.rules.unshift({
    test: /\.vert$/,
    use: { loader: 'raw-loader' },
  }, {
    test: /\.frag$/,
    use: { loader: 'raw-loader' },
  }, {
    test: /\.worker-loader\.js$/,
    use: { loader: 'worker-loader' },
  });
  const assetLoaders = config.module.rules[config.module.rules.length - 1].oneOf;
  // throw 1;
  assetLoaders[assetLoaders.length - 1].exclude.push(/\.vert$/, /\.frag$/);
  return config;
};
