import { useHotkeys } from "react-hotkeys-hook";
import { maxHeightMap, useDeviceFrameHeight } from "./constants";
import { useFullscreen } from "./stores/fullscreen";
import { useDeviceScreen } from "./stores/device-screen";
import { useScreenState } from "./stores/screen-state";

export const hotKeysConfig = {
  openHotKeys: {
    readable: ['Ctrl', 'K'],
    raw: 'ctrl+k',
    label: 'Open Hotkeys'
  },
  goToHomeScreen: {
    readable: ['Ctrl', 'h'],
    raw: 'ctrl+h',
    label: 'Go to home screen'
  },
  toggleFullScreen: {
    readable: ['F11'],
    raw: 'F11',
    label: 'Toggle Fullscreen'
  },
  closeApplication: {
    readable: ['Alt', 'F4'],
    raw: 'alt+f4',
    label: 'Close Application'
  },
} as const

export const registerAppWideHotKeys = () => {
  const { isFullscreen, setIsFullscreen } = useFullscreen()
  const { setDeviceFrameHeightClass } = useDeviceFrameHeight()
  const { deviceScreen, setDeviceScreen } = useDeviceScreen()
  const { setScreenState } = useScreenState()
  useHotkeys(hotKeysConfig.toggleFullScreen.raw, () => {
    if (isFullscreen) {
      setIsFullscreen(false);
      setDeviceFrameHeightClass(maxHeightMap.minimize);
    }  else {
      setIsFullscreen(true);
      setDeviceFrameHeightClass(maxHeightMap.fullscreen);
    }
  })
  useHotkeys(hotKeysConfig.goToHomeScreen.raw, () => {
    if (deviceScreen === 'app-screen') (setScreenState("before-close-app"), setDeviceScreen("home-screen"))
  })
}
