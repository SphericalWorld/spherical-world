module.exports = {
  "extends": ["airbnb", "plugin:flowtype/recommended"],
  "parser": "babel-eslint",
  "plugins": [
    "babel",
    "flowtype"
  ],
  "env": {
    "browser": true,
    "mocha": true
  },
  "rules": {
    "no-bitwise": "off",
    "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
    "max-depth": ["error", 4],
    "complexity": ["error", 11],
    "babel/no-unused-expressions": "error",
    "no-unused-expressions": "off",
    "implicit-arrow-linebreak": "off",
    "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
    "array-callback-return": "off", // unfortunately this rule is broken in eslint with lots false-positives
    "jsx-a11y/label-has-associated-control": "off",
    "react/require-default-props": "off", // just broken rule, false positives everywhere
    "react/default-props-match-prop-types": "off", // same here
  },
};
