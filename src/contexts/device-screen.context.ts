import { createContext, Dispatch, SetStateAction, useContext } from "react";

type DeviceScreenContextType = {
  src: string,
  setSrc: Dispatch<SetStateAction<string>>
}

const DeviceScreenContext = createContext<DeviceScreenContextType | null>(null);

const useDeviceScreen = () => {
  const iframeSrcContext = useContext(DeviceScreenContext);
  if (!iframeSrcContext) {
    throw new Error("useDeviceScreen must be used within a DeviceScreenProvider");
  }
  return iframeSrcContext;
};

export {
  DeviceScreenContext,
  useDeviceScreen
}



export const useDeviceScreen = function () {
  return () => ({
    deviceScreen, setDeviceScreen
  })
}()
