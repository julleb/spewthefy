const reactVersion = require("react/package.json").version;

module.exports = {
  root: true,
  parser: "@babel/eslint-parser",
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: "module",
  },
  settings: {
    react: {
      version: reactVersion,
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  plugins: ["react", "react-hooks", "prettier"],
  rules: {
    "prettier/prettier": "warn",
    "no-console": ["warn", {allow: ["debug", "warn", "error"]}],
    "no-debugger": "error",
    "no-alert": "error",
    eqeqeq: "warn",
    "no-var": "warn",
    "prefer-const": "warn",
    "no-shadow": "off",
    "no-shadow-restricted-names": "error",
    "react/react-in-jsx-scope": "error",
    "react/jsx-uses-react": "warn",
    "react/jsx-uses-vars": "warn",
    "react/prop-types": "off",
    "react/display-name": "off",
    "react/prefer-stateless-function": "warn",
    "react/no-array-index-key": "warn",
    "react/no-this-in-sfc": "warn",
    "react-hooks/rules-of-hooks": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "no-unused-vars": ["warn", {ignoreRestSiblings: true}],
  },
};
