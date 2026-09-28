const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    rules: {
      // Async screen loaders reset stale content when their date/profile changes.
      // React Compiler is not enabled; these guarded effect resets are intentional.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]);
