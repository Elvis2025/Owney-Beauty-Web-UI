const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const angularPlugin = require('@angular-eslint/eslint-plugin');
const templateParser = require('@angular-eslint/template-parser');
const templatePlugin = require('@angular-eslint/eslint-plugin-template');

module.exports = [
  { ignores: ['dist/**', 'node_modules/**'] },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: ['./tsconfig.json'], tsconfigRootDir: __dirname },
    },
    plugins: { '@typescript-eslint': tsPlugin, '@angular-eslint': angularPlugin },
    processor: templatePlugin.processors['extract-inline-html'],
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: ['app', 'ob'], style: 'kebab-case' }],
    },
  },
  {
    files: ['src/**/*.html'],
    languageOptions: { parser: templateParser },
    plugins: { '@angular-eslint/template': templatePlugin },
    rules: {},
  },
];
