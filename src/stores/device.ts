import { type Device, DEVICE_MAPPIING_KEYS } from "../device-mapping";
import { create } from "zustand/react";

const LOCALSTORAGE_KEY = "MobilyResponsive_lastUsedDevice";

const defaultSelectedDevice: Device = ((): Device => {
  const lastUsed = localStorage.getItem(LOCALSTORAGE_KEY) as Device;
  if (!lastUsed || !(DEVICE_MAPPIING_KEYS.includes(lastUsed))) return DEVICE_MAPPIING_KEYS.at(0)!;
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
}))
