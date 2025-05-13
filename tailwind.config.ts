import plugin from "tailwindcss/plugin";
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
        Helvetica_Neue: ["Helvetica_Neue", "Arial"],
      },
      backgroundColor: {
        "sidebar-button": "#939393",
      },
    },
  },
  prefix: "tws-",
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.wallpaper-iphone-15': {
          background: `url(../assets/images/iphone-alpinisme-wallpaper.png)`
        },
        '.wallpaper-iphone-16-pro': {
          background: `url(../assets/images/iphone-escalade-wallpaper.png)`
        },
        '.wallpaper-after-app-launch': {
          background: 'black'
        }
      });
    }),
  ],
} satisfies Config;
