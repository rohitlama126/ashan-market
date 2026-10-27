import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Workspace packages ship TypeScript source.
  transpilePackages: ['@ashan/core', '@ashan/i18n', '@ashan/schemas', '@ashan/tokens'],
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
