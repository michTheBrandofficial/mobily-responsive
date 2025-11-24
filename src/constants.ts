import { BaseDirectory } from "@tauri-apps/api/fs";
import { Device } from "./device-mapping";
import { useFullscreen } from "./stores/fullscreen";
import { Dispatch } from "react";
import { create } from "zustand/react";

export const containerStyles = {
  overflow: "hidden",
  position: "absolute",
  zIndex: 300,
} as const;

export const maxHeightMap = {
  fullscreen: " tws-max-h-[100vh] ",
  minimize: " tws-max-h-[93.6vh] ",
} as const;

type DeviceFrameHeightStore = {
  deviceFrameHeightClass: (typeof maxHeightMap)[keyof typeof maxHeightMap];
  setDeviceFrameHeightClass: Dispatch<
    DeviceFrameHeightStore["deviceFrameHeightClass"]
  >;
};

export const useDeviceFrameHeight = create<DeviceFrameHeightStore>(
  (set, get) => ({
    deviceFrameHeightClass: useFullscreen.getState().isFullscreen
      ? maxHeightMap.fullscreen
      : maxHeightMap.minimize,
    setDeviceFrameHeightClass(frameHeight) {
      set({
        ...get(),
        deviceFrameHeightClass: frameHeight,
      });
    },
  }),
);

export const AppLocalData = BaseDirectory.AppLocalData;

export const dataDir = `./MobilyResponsiveData`;

export const FSOptions = {
  dir: AppLocalData,
} as const;

export const homeScreenIconScale = 1.4;

export const LOCALSTORAGE_ALWAYS_ON_TOP_KEY = "MobilyResponsive_always_on_top";

export const LOCALSTORAGE_HAS_BEZELS_KEY = "MobilyResponsive_has_bezels";

export const lastAlwaysOnTop = ((): "true" | "false" => {
  const lastUsed = localStorage.getItem(LOCALSTORAGE_ALWAYS_ON_TOP_KEY) as
    | "true"
    | "false"
    | null;
  if (!lastUsed) return "false";
  else return lastUsed;
})();

export const lastHasBezels = ((): "true" | "false" => {
  const lastUsed = localStorage.getItem(LOCALSTORAGE_HAS_BEZELS_KEY) as
    | "true"
    | "false"
    | null;
  if (!lastUsed) return "false";
  else return lastUsed;
})();

export { type Device };
