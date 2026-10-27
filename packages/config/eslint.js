// Shared flat config for TypeScript packages. Apps extend their framework's config instead.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'generated/**', 'coverage/**'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
);
