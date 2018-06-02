const { injectBabelPlugin, getBabelLoader } = require('react-app-rewired');
const path = require('path');

module.exports = function override(config, env) {
  getBabelLoader(config.module.rules).options.babelrc = true;
  getBabelLoader(config.module.rules).options.presets = [];
  getBabelLoader(config.module.rules).include = [getBabelLoader(config.module.rules).include, path.resolve(__dirname, 'common')];
  // throw 1;
  config = injectBabelPlugin('babel-plugin-transform-decorators-legacy', config);
  config = injectBabelPlugin('transform-do-expressions', config);
  config.resolve.plugins.splice(
    config.resolve.plugins.indexOf(config.resolve.plugins.find(el => el.constructor.name === 'ModuleScopePlugin')),
    1,
  );
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
