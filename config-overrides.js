const path = require('path');
const babelConfig = require('./.babelrc');

const getBabelLoader = (config) => {
  const babelLoaderFilter = (rule) =>
    rule.loader && rule.loader.includes('babel') && rule.options && rule.options.plugins;

  let loaders = config.module.rules.find((rule) => Array.isArray(rule.oneOf)).oneOf;

  let babelLoader = loaders.find(babelLoaderFilter);

  if (!babelLoader) {
    loaders = loaders.reduce((ldrs, rule) => ldrs.concat(rule.use || []), []);
    babelLoader = loaders.find(babelLoaderFilter);
  }
  return babelLoader;
};

const disableEslint = (config) => {
  config.plugins = config.plugins.filter((el) => !(el && el.options && el.options.eslintPath));
};

module.exports = function override(config, env) {
  const {
    module: { rules },
  } = config;
  disableEslint(config);
  const assetLoaders = rules[rules.length - 1].oneOf;

  const babelLoader = getBabelLoader(config);
  delete babelLoader.options.presets;
  delete babelLoader.options.plugins;
  babelLoader.options.babelrc = true;

  babelLoader.include = [babelLoader.include, path.resolve(__dirname, 'common')];
  // throw 1;
  config.resolve.plugins.splice(
    config.resolve.plugins.indexOf(
      config.resolve.plugins.find((el) => el.constructor.name === 'ModuleScopePlugin'),
    ),
    1,
  );
  rules.unshift(
    {
      test: /\.(vert|frag)$/,
      use: { loader: 'raw-loader' },
    },
    {
      test: /\.worker-loader\.js$/,
      use: { loader: 'worker-loader' },
    },
  );
  config.output = {
    ...config.output,
    globalObject: 'this',
  };
  assetLoaders
    .find((loader) => loader.test.toString().includes('module\\.css'))
    .use.splice(1, 0, '@teamsupercell/typings-for-css-modules-loader');

  assetLoaders[assetLoaders.length - 1].exclude.push(/\.vert$/, /\.frag$/);
  if (env === 'production') {
    config.mode = 'development';
    config.optimization.minimize = false;
    config.plugins[0].options.minify.minifyJS = false;
  }
  return config;
};

module.exports.disableEslint = disableEslint;
