import { signal } from "nixix/primitives";
import { Device } from "./device-mapping";

export const containerStyles = {
  overflow: "hidden",
  position: "absolute",
  zIndex: 300,
} as const;

export const [deviceFrameHeightClass, setDeviceFrameHeightClass] =
  signal(" tws-h-[98.5vh] ");

export const defaultSelectedDevice: Device =
  (localStorage.getItem("lastUsedDevice") as Device) || "iphone-14-pro-max";
