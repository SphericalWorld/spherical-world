module.exports = () => {
  const presets = ['@babel/preset-typescript'];
  const plugins = [
    '@babel/plugin-transform-flow-strip-types',
    '@babel/transform-modules-commonjs',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-object-rest-spread',
  ];
  return { plugins, presets };
};
