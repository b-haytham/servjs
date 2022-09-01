module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    semi: 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/semi': 'error',
    'prettier/prettier': 'error',
  },
};
