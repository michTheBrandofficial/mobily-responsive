import { Dispatch } from "react";
import { create } from "zustand/react";

type DeviceScreen = {
  src: string;
  setSrc: Dispatch<string>;
};

export const useDeviceScreen = create<DeviceScreen>((set, get) => ({
  src: "",
  setSrc: (src) => {
    set({
      ...get(),
      src: src
    });
  },
}));
