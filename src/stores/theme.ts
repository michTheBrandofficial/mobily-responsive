import { signal } from "nixix/primitives";

const LOCALSTORAGE_KEY = "MobilyResponsive_lastUsedTheme";

type Theme = 'dark' | 'light';

const lastUsedTheme = ((): Theme => {
  const lastUsed = localStorage.getItem(LOCALSTORAGE_KEY) as Theme | null;
  if (!lastUsed) return 'dark';
  else return lastUsed;
})();

export const useTheme = (function () {
  const [theme, setTheme] = signal<Theme>(lastUsedTheme);
  return () => {
    return {
      theme,
      setTheme: (theme: Theme) => {
        localStorage.setItem(LOCALSTORAGE_KEY, theme.toString());
        setTheme(theme);
      },
    };
  };
})();
