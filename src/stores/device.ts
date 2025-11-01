import { type Device } from "../device-mapping";
import { create } from "zustand/react";

const LOCALSTORAGE_KEY = "MobilyResponsive_lastUsedDevice";

const defaultSelectedDevice: Device = ((): Device => {
  const lastUsed = localStorage.getItem(LOCALSTORAGE_KEY) as Device;
  if (!lastUsed) return "iphone-16-pro";
  else return lastUsed;
})();

type DeviceStore = {
	device: Device;
	setDevice: (device: Device) => void;
};

export const useDevice = create<DeviceStore>((set, get) => ({
  device: defaultSelectedDevice,
  setDevice(device) {
    localStorage.setItem(LOCALSTORAGE_KEY, device);
    set({
      ...get(),
      device: device
    })
  },
})
