import globals from "globals";
import path from 'path';
import eslintCustomRules from './eslint-custom-rules/index.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    plugins: {
      "eslint-custom-rules": eslintCustomRules
    },
    rules: {
      "max-lines": ["warn", { "max": 300, "skipBlankLines": true, "skipComments": true }],
      "camelcase": ["error", { "properties": "always" }],
      "prefer-const": "error",
      "eslint-custom-rules/max-nested-for": "error",
      "eslint-custom-rules/variable-name-length": ["error", { "maxLength": 20, "minLength": 3 }],
    }
  }
];