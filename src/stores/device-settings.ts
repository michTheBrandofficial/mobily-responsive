import { Dispatch } from "react";
import { create } from "zustand/react";

type Settings = {
  theme_color: "white" | "transparent" | (string & {});
};

type DeviceSettings = {
  settings: Settings;
  setSettings: Dispatch<Settings>;
};

const defaultSettings: Settings = {
  theme_color: "white",
};

export const useDeviceSettings = create<DeviceSettings>((set, get) => ({
  settings: defaultSettings,
  setSettings: (settings) => {
    set({
      ...get(),
      settings,
    });
  },
}));
