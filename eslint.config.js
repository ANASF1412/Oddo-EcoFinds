// ESLint flat config with proper environments for Node and Browser files
import js from "@eslint/js";

export default [
  js.configs.recommended,
  // Default: Node.js environment for backend files
  {
    files: ["**/*.js"],
    ignores: [
      "node_modules/**",
      "frontend/img/**",
      "frontend/css/**"
    ],
    languageOptions: {
      globals: {
        // Node globals
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        process: "readonly",
        console: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
    }
  },
  // Browser environment for frontend JS
  {
    files: ["frontend/js/**/*.js"],
    languageOptions: {
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        URLSearchParams: "readonly",
        FormData: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        console: "readonly"
      }
    }
  }
];