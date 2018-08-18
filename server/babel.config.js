module.exports = () => {
  const plugins = [
    '@babel/plugin-transform-flow-strip-types',
    '@babel/transform-modules-commonjs',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-syntax-object-rest-spread',
  ];
  return { plugins };
};
