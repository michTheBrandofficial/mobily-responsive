import plugin from "tailwindcss/plugin";

const WallPapersConfig = plugin(({ addUtilities }) => {
  addUtilities({
    ".wallpaper-iphone-15": {
      background: `url(../assets/images/iphone-15-wallpaper.jpg)`,
    },
    ".wallpaper-iphone-16-pro": {
      background: `url(../assets/images/iphone-16-pro-wallpaper.jpg)`,
    },
    ".wallpaper-ipad-pro-i13": {
      background: `url(../assets/images/ipad-pro-i13-wallpaper.jpg)`
    },
    ".wallpaper-after-app-launch": {
      background: "black",
    },
  });
})

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "index.html",
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
  plugins: [WallPapersConfig],
}
