import { BaseDirectory } from "@tauri-apps/api/fs";
import { ref, signal } from "nixix/primitives";
import { Device } from "./device-mapping";

export const containerStyles = {
  overflow: "hidden",
  position: "absolute",
  zIndex: 300,
} as const;

export const [deviceFrameHeightClass, setDeviceFrameHeightClass] =
  signal(" tws-max-h-[93.6vh] ");

export const AppLocalData = BaseDirectory.AppLocalData;

export const dataDir = `./MobilyResponsiveData`;

export const FSOptions = {
  dir: AppLocalData,
} as const;

export const homeScreenIconScale = 1.4;

export const iframeRef = ref<HTMLIFrameElement>();

export { type Device };
