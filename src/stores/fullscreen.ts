import { signal } from "nixix/primitives";

const LOCALSTORAGE_FULLSCREEN_KEY = "MobilyResponsive_fullscreen";

const lastFullscreen = ((): "true" | "false" => {
  const lastUsed = localStorage.getItem(LOCALSTORAGE_FULLSCREEN_KEY) as
    | "true"
    | "false"
    | null;
  if (!lastUsed) return "false";
  else return lastUsed;
})();

export const useFullscreen = (function () {
  const [isFullscreen, setIsFullscreen] = signal(lastFullscreen === "true");
  return () => {
    return {
      isFullscreen,
      setIsFullscreen: (isFullscreen: boolean) => {
        localStorage.setItem(
          LOCALSTORAGE_FULLSCREEN_KEY,
          isFullscreen ? "true" : "false"
        );
        setIsFullscreen(isFullscreen);
      },
    };
  };
})();
