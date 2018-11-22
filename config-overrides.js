const { getBabelLoader } = require('react-app-rewired');
const path = require('path');
const babelConfig = require('./.babelrc');

module.exports = function override(config, env) {
  getBabelLoader(config.module.rules).options.presets = babelConfig.presets;
  getBabelLoader(config.module.rules).options.plugins = babelConfig.plugins;
  getBabelLoader(config.module.rules).include = [getBabelLoader(config.module.rules).include, path.resolve(__dirname, 'common')];
  // throw 1;
  config.resolve.plugins.splice(
    config.resolve.plugins.indexOf(config.resolve.plugins.find(el => el.constructor.name === 'ModuleScopePlugin')),
    1,
  );
  config.module.rules.unshift({
    test: /\.(vert|frag)$/,
    use: { loader: 'raw-loader' },
  }, {
    test: /\.worker-loader\.js$/,
    use: { loader: 'worker-loader' },
  });
  config.output = {
    ...config.output,
    globalObject: 'this'
  };
  const assetLoaders = config.module.rules[config.module.rules.length - 1].oneOf;
  // throw 1;
  assetLoaders[assetLoaders.length - 1].exclude.push(/\.vert$/, /\.frag$/);
  return config;
};
