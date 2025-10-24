import defineConfig from '@hellolin/eslint-config';

const config = await defineConfig({
  javascript: {
    env: {
      node: true,
    },
  },
  yaml: true,
});

export default [
  ...config,
  {
    languageOptions: {
      globals: {
        Bun: 'readonly',
      },
    },
  },
];
