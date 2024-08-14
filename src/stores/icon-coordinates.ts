import { store } from "nixix/primitives";

export const useIconCoordinates = (function () {
  const [iconCoordinates, setIconCoordinates] = store<[number, number, boolean]>([
    0, 0, true
  ]);
  return () => {
    return { iconCoordinates, setIconCoordinates };
  };
})();
