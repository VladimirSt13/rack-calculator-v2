import globals from 'globals'
import pluginVitest from '@vitest/eslint-plugin'

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: globals.parsers.typescript,
      sourceType: 'module',
    },
    plugins: {
      vitest: pluginVitest,
    },
    rules: {
      ...pluginVitest.configs.recommended.rules,
    },
  },
]
