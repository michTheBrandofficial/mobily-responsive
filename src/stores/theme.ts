import { pipe } from "@/lib/pipe";
import { Dispatch } from "react";
import { create } from "zustand/react";

const LOCALSTORAGE_KEY = "MobilyResponsive_lastUsedTheme";

type Theme = "dark" | "light";

const lastUsedTheme = pipe(
  localStorage.getItem(LOCALSTORAGE_KEY) as Theme | null,
  (lastUsed) => {
    if (!lastUsed) return "dark";
    else return lastUsed;
  },
);

type ThemeStore = {
  theme: Theme;
  setTheme: Dispatch<Theme>;
};

export const useDevice = create<ThemeStore>((set, get) => ({
  theme: lastUsedTheme,
  setTheme(theme) {
    localStorage.setItem(LOCALSTORAGE_KEY, theme);
    set({
      ...get(),
      theme,
    });
  },
}));
