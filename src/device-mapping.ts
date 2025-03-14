import Iphone15 from "./frames/iphone-15";
import Iphone16Pro from "./frames/iphone-16-pro";

export const DEVICE_MAPPING = {
  "iphone-15": {
    component: Iphone15,
    displayName: "iPhone 15",
    iosVersion: "17.0",
  },
  "iphone-16-pro": {
    component: Iphone16Pro,
    displayName: "iPhone 16 Pro",
    iosVersion: "18.2"
  },
} as const;

export type Device = keyof typeof DEVICE_MAPPING;

export type DeviceDisplayName = (typeof DEVICE_MAPPING)[Device]["displayName"];
