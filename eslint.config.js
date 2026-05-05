// Flat-config for ESLint v10 — TS + React + Storybook source files.
// Trust `tsc --noEmit` (`pnpm typecheck`) for full type checking; ESLint here
// catches the syntax / hygiene / hooks-rules / dead-code class of issues.
//
// Plugins are registered so existing inline `// eslint-disable-next-line
// react/...` directives across the codebase still resolve to a known rule.

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'storybook-static/**',
      'src/tokens/tokens.ts', // generated file
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    linterOptions: {
      // Pre-existing icon files carry `/* eslint-disable
      // react/jsx-props-no-spreading */` directives that target a rule the
      // active config no longer enforces. We intentionally don't strip those
      // comments en masse — they keep the icons forward-compatible with a
      // stricter config — so silence the meta-warning here.
      reportUnusedDisableDirectives: 'off',
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    settings: {
      react: { version: '19.0.0' },
    },
    rules: {
      // The repo intentionally allows `any` in a few escape hatches and
      // unused vars in interface declarations / generic type params.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true },
      ],
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'warn',
      '@typescript-eslint/triple-slash-reference': 'off',
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-prototype-builtins': 'off',
      'no-useless-escape': 'warn',
      'no-cond-assign': ['error', 'except-parens'],
      'no-control-regex': 'off',
      // React-specific — opinionated for a component library
      'react/jsx-uses-react': 'off', // React 17+ JSX transform
      'react/react-in-jsx-scope': 'off', // React 17+ JSX transform
      'react/prop-types': 'off', // TS provides prop validation
      'react/display-name': 'off',
      'react/jsx-no-target-blank': ['error', { allowReferrer: false }],
      'react/no-unescaped-entities': 'off',
      // eslint-plugin-react 7.x has bugs with ESLint v10's flat config —
      // 'react/no-unknown-property' calls getFilename in a way that breaks.
      'react/no-unknown-property': 'off',
      // Existing icon files have legacy `// eslint-disable react/jsx-props-no-spreading`
      // directives. Keep the rule registered as 'off' so those directives don't
      // fire "unused eslint-disable" warnings — without re-enabling the rule.
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-key': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  // Storybook stories often define inline `render` callbacks that use hooks.
  // The React Hooks rule treats those as non-component functions and reports
  // false positives. Relax there.
  {
    files: ['src/**/*.stories.{ts,tsx}', 'src/**/__tests__/**/*.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
];
