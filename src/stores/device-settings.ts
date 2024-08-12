import { store } from "nixix/primitives";

type Settings = {
  theme_color: 'white' | (string & {}) ;
}

export const [$deviceSettings, $setDeviceSettings] = store<Settings>({
  theme_color: ''
})