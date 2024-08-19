import type { Config } from 'tailwindcss';
import { TwcConfig, createThemes } from 'tw-colors';
import colorThemes from './src/styles/colorThemes';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/styles/globalTailwind.ts',
    ],
    plugins: [
        createThemes(colorThemes as TwcConfig<keyof typeof colorThemes>, {
            defaultTheme: 'orange',
            strict: true,
        }),
    ],
    darkMode: 'class',
};
export default config;
