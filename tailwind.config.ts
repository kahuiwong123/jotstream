import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        "light-grey": "#FAFAFA",
        "dark-grey": "#262626",
        "light-grey-hover": "#EFEFED",
        "dark-side": "#262626",
        "dark-main": "#1E1E1E",
        "white-main": "#FFFFFF",
        "blue-accent": "#00B8FF"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
