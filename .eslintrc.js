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
    // The mailtrap SDK logs a DeprecationWarning for these names.
    "no-restricted-properties": [
      "error",
      {
        property: "testing",
        message: "Deprecated in the mailtrap SDK: use client.sandbox.",
      },
      {
        property: "sendingDomains",
        message: "Deprecated in the mailtrap SDK: use client.domains.",
      },
    ],
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
