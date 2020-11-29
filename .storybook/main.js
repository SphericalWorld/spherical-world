const { disableEslint } = require('../config-overrides');

module.exports = {
  stories: ['../src/**/*.stories.@(tsx|mdx)'],
  addons: ['@storybook/addon-essentials', '@storybook/preset-create-react-app'],
  webpackFinal: async (config, { configType }) => {
    disableEslint(config)
    return config;
  },
}
