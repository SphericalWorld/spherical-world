module.exports = {
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'prettier',
    'prettier/react',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', 'react-hooks', '@typescript-eslint'],
  env: {
    browser: true,
    mocha: true,
  },
  rules: {
    'import/extensions': [
      'error',
      'always',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never',
      },
    ],
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    '@typescript-eslint/prefer-as-const': 'off', // garbage rule
    'prettier/prettier': 'error',
    'no-bitwise': 'off',
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'max-depth': ['error', 4],
    complexity: ['error', 11],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'array-callback-return': 'off', // unfortunately this rule is broken in eslint with lots false-positives
    'react/require-default-props': 'off', // just broken rule, false positives everywhere
    'react/default-props-match-prop-types': 'off', // same here
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.stories.tsx'] }],
    'import/prefer-default-export': 'off',
    'func-style': ['error', 'expression', { allowArrowFunctions: true }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'max-classes-per-file': 'off',
    'consistent-return': 'off', // garbage rule, forbids totally valid cases
    'no-use-before-define': 'off', // sometimes doesn't work properly and redundand with TS checker
  },
};
