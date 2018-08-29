module.exports = {
  extends: 'stylelint-config-sass-guidelines',
  rules: {
    'selector-class-pattern': [
      '^[a-z][A-Za-z0-9]*$',
      { message: 'Selector should be written in camelCase' },
    ],
  },
};
