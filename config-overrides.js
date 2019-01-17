const path = require('path');
const babelConfig = require('./.babelrc');

const getBabelLoader = config => {
  const babelLoaderFilter = rule =>
    rule.loader
    && rule.loader.includes('babel')
    && rule.options
    && rule.options.plugins;

  let loaders = config.module.rules.find(rule => Array.isArray(rule.oneOf))
    .oneOf;

  let babelLoader = loaders.find(babelLoaderFilter);

  if (!babelLoader) {
    loaders = loaders.reduce((ldrs, rule) => ldrs.concat(rule.use || []), []);
    babelLoader = loaders.find(babelLoaderFilter);
  }
  return babelLoader;
};

module.exports = function override(config, env) {
  const { module: { rules } } = config;
  const assetLoaders = rules[rules.length - 1].oneOf;

  getBabelLoader(config).options.presets = babelConfig.presets;
  getBabelLoader(config).options.plugins = babelConfig.plugins;
  getBabelLoader(config).include = [getBabelLoader(config).include, path.resolve(__dirname, 'common')];
  // throw 1;
  config.resolve.plugins.splice(
    config.resolve.plugins.indexOf(config.resolve.plugins.find(el => el.constructor.name === 'ModuleScopePlugin')),
    1,
  );
  rules.unshift({
    test: /\.(vert|frag)$/,
    use: { loader: 'raw-loader' },
  }, {
    test: /\.worker-loader\.js$/,
    use: { loader: 'worker-loader' },
  });
  config.output = {
    ...config.output,
    globalObject: 'this',
  };
  assetLoaders.find(loader => loader.test.toString().includes('module\\.(scss')).use.splice(1, 0, 'css-modules-flow-types-loader');
  assetLoaders[assetLoaders.length - 1].exclude.push(/\.vert$/, /\.frag$/);
  return config;
};
