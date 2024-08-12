import { type Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./node_modules/nixix/view-components/index.tsx",
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Rubik: ["Rubik", "sans-serif"],
        Satoshi: ["Satoshi", "sans-serif"],
        DM_Sans: ["DM_Sans", "Arial"],
      },
    },
  },
  prefix: "tws-",
  plugins: [],
} satisfies Config;
