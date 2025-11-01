import { Dispatch } from "react";
import { create } from "zustand/react";

type IconCoordinateStore = {
  iconCoordinates: [number, number, true];
  setIconCoordinates: Dispatch<IconCoordinateStore['iconCoordinates']>;
};

/**
 * @outdated home screen icon to app animation will be embedded into the icon soon
 */
export const useIconCoordinates = create<IconCoordinateStore>((set, get) => ({
  iconCoordinates: [0, 0, true],
  setIconCoordinates: (coordinates) => {
    set({
      ...get(),
      iconCoordinates: coordinates
    });
  },
}));
