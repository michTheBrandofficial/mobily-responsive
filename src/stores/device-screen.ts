import { Dispatch } from "react";
import { create } from "zustand/react";

type DeviceScreen = {
  deviceScreen: "app-screen" | "home-screen";
  setDeviceScreen: Dispatch<DeviceScreen["deviceScreen"]>;
};

export const useDeviceScreen = create<DeviceScreen>((set, get) => ({
  deviceScreen: "home-screen",
  setDeviceScreen: (screen) => {
    set({
      ...get(),
      deviceScreen: screen,
    });
  },
}));
