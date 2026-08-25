import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    ignores: [
      "dist/**",
      "coverage/**",
      "node_modules/**",
    ],
  },

  js.configs.recommended,

  {
    files: ["**/*.{js,jsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },

      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    rules: {
      ...reactHooks.configs.flat.recommended.rules,

      // This rule is too strict for existing UI state-reset effects.
      "react-hooks/set-state-in-effect": "off",

      "react-refresh/only-export-components": "warn",

      "no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },

  {
    files: ["src/tests/**/*.{js,jsx}"],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,

        describe: "readonly",
        it: "readonly",
        test: "readonly",

        expect: "readonly",

        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",

        vi: "readonly",
      },
    },
  },
];