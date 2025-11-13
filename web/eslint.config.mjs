import react from "eslint-plugin-react";
import typescript from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
// ESLint v9 already includes recommended rules by default, so no need to import them separately

export default [
  // Base configuration for all files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: "readonly",
      },
    },
    plugins: {
      react,
      "@typescript-eslint": typescript,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Type checking rules
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      
      // React rules
      "react/prop-types": "off", // Using TypeScript instead
      
      // Best practices
      "no-console": ["warn", { allow: ["warn", "error"] }],
      
      // Tailwind CSS rules
      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/classnames-order": "warn"
    },
  },
  
  // TypeScript recommended rules
  ...typescript.configs.recommended,
  
  // React recommended rules
  ...react.configs.recommended,
  react.configs["jsx-runtime"][0],
  
  // Tailwind CSS rules
  {
    extends: ["plugin:tailwindcss/recommended"],
  },
  
  // Test files configuration
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off"
    }
  }
];