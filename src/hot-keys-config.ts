import { useCommandTriggeredModal } from "@/components/command-triggered-hotkeys";
import { useHotkeys } from "react-hotkeys-hook";
import { maxHeightMap, useDeviceFrameHeight } from "./constants";
import { useDeviceScreen } from "./stores/device-screen";
import { useFullscreen } from "./stores/fullscreen";
import { useScreenState } from "./stores/screen-state";

export const fileSpecificHotKeysConfig = {
	/**
	 * @dev this will be instantiated in the app-screen file
	 */
	reloadUrl: {
		keys: ["Ctrl K", "R"],
		raw: "ctrl>k>r",
		label: "Reload",
	},
};

export const userFacingHotKeysConfig = {
	goToHomeScreen: {
		keys: ["Ctrl", "H"],
		raw: "ctrl+h",
		label: "Home",
	},
	...fileSpecificHotKeysConfig,
	changeUrl: {
		keys: ["Ctrl", "L"],
		raw: "ctrl+l",
		label: "Enter Url",
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
	const { setCommandModal } = useCommandTriggeredModal();
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
	useHotkeys(hotKeysConfig.changeUrl.raw, () => {
		if (deviceScreen === "app-screen") setCommandModal("url-input", true);
	});
};
