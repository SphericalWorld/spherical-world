require('@babel/register')({
  presets: ['@babel/preset-typescript'],
  plugins: ['@babel/transform-modules-commonjs', './common/ecs/utils/babelPlugin.js'],
  extensions: ['.js', '.ts'],
});

require('./chunkGeneratorThread.ts');
