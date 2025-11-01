import { signal } from "nixix/primitives";

type ScreenState = 'none' | 'after-app-launch' | 'before-close-app';

export const useScreenState = (function () {
  const [screenState, setScreenState] = signal<ScreenState>('none');
  return () => {
    return {
      screenState,
      setScreenState
    };
  };
})();
