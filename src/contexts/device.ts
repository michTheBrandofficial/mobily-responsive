import { signal } from "nixix/primitives";
import { type Device } from "../device-mapping";

const LOCALSTORAGE_KEY = "MobilyResponsive_lastUsedDevice";

const defaultSelectedDevice: Device = ((): Device => {
  const lastUsed = localStorage.getItem(LOCALSTORAGE_KEY) as Device;
  if (!lastUsed) return "iphone-16-pro";
  else return lastUsed;
})();

export const useDevice = (function () {
  const [device, setDevice] = signal<Device>(defaultSelectedDevice);
  return () => {
    return { device, setDevice: (device: Device) => {
      localStorage.setItem(LOCALSTORAGE_KEY, device);
      setDevice(device);
    } };
  };
})();
