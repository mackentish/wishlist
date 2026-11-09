import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';

const config = [
    {
        ignores: ['.next/**', 'out/**', 'next-env.d.ts', 'prisma/generated/**'],
    },
    ...nextCoreWebVitals,
    prettier,
    {
        files: ['src/app/layout.tsx'],
        rules: {
            '@next/next/no-page-custom-font': 'off',
        },
    },
];

export default config;
