module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: "airbnb",
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        ".eslintrc.{js,cjs}",
      ],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "react",
    "import",
  ],
  ignorePatterns: ["server/"],
  rules: {
    "max-len": ["error", { code: 120 }],
    "no-param-reassign": ["error", { props: false }],
    "react/require-default-props": "off",
    "react/no-array-index-key": "off",
    "linebreak-style": "off",
    "react/jsx-props-no-spreading": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "import/order":
      [
        1,
        {
          "newlines-between": "always",
          groups:
            [
              "external",
              "builtin",
              "internal",
              ["sibling", "parent"],
              "index",
            ],
        },
      ],
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
  },
};
