import { useHotkeys } from "react-hotkeys-hook";
import { maxHeightMap, useDeviceFrameHeight } from "./constants";
import { useDeviceScreen } from "./stores/device-screen";
import { useFullscreen } from "./stores/fullscreen";
import { useScreenState } from "./stores/screen-state";

export const userFacingHotKeysConfig = {
	// openHotKeys: {
	//   keys: ["Ctrl", "K"],
	//   raw: "ctrl+k",
	//   label: "Hotkeys",
	// },
	goToHomeScreen: {
		keys: ["Ctrl", "H"],
		raw: "ctrl+h",
		label: "Home",
	},
	toggleFullScreen: {
		keys: ["F11"],
		raw: "F11",
		label: "Fullscreen",
	},
	toggleDevtools: {
		keys: ["F12"],
		raw: "F12",
		label: "Devtools",
	},
	closeApplication: {
		keys: ["Alt", "F4"],
		raw: "alt+f4",
		label: "Quit",
	},
} as const;

const hotKeysConfig = {
	...userFacingHotKeysConfig,
} as const;

export const registerAppWideHotKeys = () => {
	const { isFullscreen, setIsFullscreen } = useFullscreen();
	const { setDeviceFrameHeightClass } = useDeviceFrameHeight();
	const { deviceScreen, setDeviceScreen } = useDeviceScreen();
	const { setScreenState } = useScreenState();
	useHotkeys(hotKeysConfig.toggleFullScreen.raw, () => {
		if (isFullscreen) {
			setIsFullscreen(false);
			setDeviceFrameHeightClass(maxHeightMap.minimize);
		} else {
			setIsFullscreen(true);
			setDeviceFrameHeightClass(maxHeightMap.fullscreen);
		}
	});
	useHotkeys(hotKeysConfig.goToHomeScreen.raw, () => {
		if (deviceScreen === "app-screen")
			(setScreenState("before-close-app"), setDeviceScreen("home-screen"));
	});
};
