import { store } from "nixix/primitives";

type Settings = {
  theme_color: 'white' | 'transparent' | (string & {}) ;
}

export const useDeviceSettings = function () {
  const [deviceSettings, setDeviceSettings] = store<Settings>({
    theme_color: 'white'
  });
  return () => ({
    deviceSettings, setDeviceSettings
  })
}()