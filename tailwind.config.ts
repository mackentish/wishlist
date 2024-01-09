import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FEFCF2",
        black: "#252422",
        lightGrey: "#CCC5B9",
        darkGrey: "#3F3D39",
        primary: "#EB5E27",
      },
    },
  },
  plugins: [],
};
export default config;
