// Setting a rule replaces the list airbnb-base gives it, so its entries are
// spread back in below.
const [, ...airbnbRestrictedProperties] =
  require("eslint-config-airbnb-base/rules/best-practices").rules[
    "no-restricted-properties"
  ];

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
    // The mailtrap SDK logs a DeprecationWarning for these names. Checked
    // only on the variables that hold a MailtrapClient, so other objects can
    // still have a `testing` property: add a new client variable name here.
    "no-restricted-properties": [
      "error",
      ...airbnbRestrictedProperties,
      ...["mailtrap", "sandboxClient", "client"].flatMap((object) => [
        {
          object,
          property: "testing",
          message: "Deprecated in the mailtrap SDK: use client.sandbox.",
        },
        {
          object,
          property: "sendingDomains",
          message: "Deprecated in the mailtrap SDK: use client.domains.",
        },
      ]),
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
