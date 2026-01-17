import { Dispatch } from "react";
import { create } from "zustand/react";

type ScreenState = 'none' | 'after-app-launch' | 'before-close-app';

type ScreenStateStore = {
  screenState: ScreenState;
  setScreenState: Dispatch<ScreenState>
}

export const useScreenState = create<ScreenStateStore>((set, get) => ({
  screenState: 'none',
  setScreenState(state) {
    set({
      ...get(),
      screenState: state
    })
  },
}))
