module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "import/extensions": "off",
    "no-console": "off",
  },
  ignorePatterns: [
    "dist/**",
    "mcpb-build/**",
    "examples/**",
    ".eslintrc.js",
    "jest.config.js",
    "jest/**",
  ],
};
