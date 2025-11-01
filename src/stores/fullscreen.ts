import { Dispatch } from "react";
import { create } from "zustand/react";

const LOCALSTORAGE_FULLSCREEN_KEY = "MobilyResponsive_fullscreen";

const lastFullscreen = ((): "true" | "false" => {
  const lastUsed = localStorage.getItem(LOCALSTORAGE_FULLSCREEN_KEY) as
    | "true"
    | "false"
    | null;
  if (!lastUsed) return "false";
  else return lastUsed;
})();

type FullscreenStore = {
  isFullscreen: boolean;
  setIsFullscreen: Dispatch<boolean>;
};

export const useFullscreen = create<FullscreenStore>((set, get) => ({
  isFullscreen: lastFullscreen === "true",
  setIsFullscreen: (isFullscreen) => {
    set({
      ...get(),
      isFullscreen,
    });
  },
}));
