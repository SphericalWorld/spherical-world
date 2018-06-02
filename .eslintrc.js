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
    "no-unused-expressions": "off"
  },
};
