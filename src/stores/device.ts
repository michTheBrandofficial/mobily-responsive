import { signal } from "nixix/primitives";
import { defaultSelectedDevice } from "../constants";
import { Device } from "../device-mapping";

export const useDevice = function () {
  const [device, setDevice] = signal<Device>(defaultSelectedDevice);
  return () => {
    return { device, setDevice }
  }
}()

