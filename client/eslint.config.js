import globals from 'globals'
import pluginReact from '@eslint-react/eslint-plugin'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReactRefresh from 'eslint-plugin-react-refresh'

export default [
  {
    files: ['**/*.{ts,tsx}'],
    ...pluginReact.configs.recommended,
    languageOptions: {
      parser: globals.parsers.typescript,
      sourceType: 'module',
    },
    plugins: {
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
