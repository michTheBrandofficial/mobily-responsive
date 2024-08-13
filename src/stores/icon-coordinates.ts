import { store } from "nixix/primitives";

export const useIconCoordinates = (function () {
  const [iconCoordinates, setIconCoordinates] = store<[number, number]>([
    0, 0,
  ]);
  return () => {
    return { iconCoordinates, setIconCoordinates };
  };
})();
