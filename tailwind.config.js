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
      background: `url(../assets/images/ipad-pro-i13-wallpaper.jpg)`,
    },
    ".wallpaper-after-app-launch": {
      background: "black",
    },
  });
});

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "index.html",
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Switzer: ["Switzer", "sans-serif"],
        Open_Sans: ["Open_Sans", "sans-serif"],
      },
      backgroundColor: {
        "sidebar-button": "#939393",
      },
      colors: {
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
    },
  },
  prefix: "tws-",
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".thin-scrollbar": {
          "scrollbar-width": "0",
          "scrollbar-color": "#d3d3d3",
          "scroll-padding-left": "10px",
        },
        ".thin-scrollbar::-webkit-scrollbar": {
          width: "3px",
          height: "3px",
          "background-color": "transparent",
        },
        ".thin-scrollbar::-webkit-scrollbar-thumb:hover": {
          scale: "2",
        },
        ".thin-scrollbar::-webkit-scrollbar-thumb": {
          "background-color": "#d3d3d3",
          "border-radius": "10px",
        },
      });
    }),
    WallPapersConfig,
  ],
};
