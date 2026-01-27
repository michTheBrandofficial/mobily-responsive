import { cn } from "@/lib/cn";
import { uint8 } from "@/lib/number";
import { pipe } from "@/lib/pipe";
import { inlineSwitch, pick } from "@/lib/utils";
import { maxHeightMap, useDeviceFrameHeight } from "@/src/constants";
import { DEVICE_MAPPING } from "@/src/device-mapping";
import { useDeviceScreen } from "@/src/stores/device-screen";
import { useFullscreen } from "@/src/stores/fullscreen";
import { useLocalStorage } from "@/src/stores/local-storage";
import { useScreenState } from "@/src/stores/screen-state";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Maximize2Icon, MinusIcon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import AppSettingsMenu from "./app-menu";
import DeviceSelectMenu from "./device-select-menu";
import DeviceFrameIcon from "./icons/device-frame";
import Home from "./icons/home";
import { SearchIcon } from "./icons/search";
import Settings from "./icons/settings";
import { Button } from "./ui/buttons";
import LiquidGlass from "./ui/liquid-glass";
import { useCommandTriggeredModal } from "./command-triggered-hotkeys";

const TopNavbar: React.FC = () => {
	const simulatorAppWindow = getCurrentWindow();
	const {
		storage: { lastUsedDevice: device },
	} = useLocalStorage();
	const deviceDisplayName = pick(
		DEVICE_MAPPING[device],
		"displayName",
		"version",
	);
	const versionMemo = pipe(DEVICE_MAPPING[device], ({ type, version }) => {
		return inlineSwitch(type, ["ipad", `iPadOS ${version}`], {
			default: `iOS ${version}`,
		});
	});
	const { isFullscreen, setIsFullscreen } = useFullscreen();
	const { setScreenState } = useScreenState();
	const { setDeviceFrameHeightClass } = useDeviceFrameHeight();
	const { setDeviceScreen, deviceScreen } = useDeviceScreen();
	const { setCommandModal } = useCommandTriggeredModal();
	const classMemo = isFullscreen ? "tws-hidden" : "tws-flex";
	const [mixingPercentage, setMixingPercentage] = useState(12);
	const [startBlur, setStartBlur] = useState(false);
	useEffect(() => {
		setStartBlur(true);
		const timer = setTimeout(() => {
			setStartBlur(false);
		}, 100);
		return () => clearTimeout(timer);
	}, [deviceScreen]);
	useEffect(() => {
		function onBlur() {
			setMixingPercentage(0);
		}
		function onFocus() {
			setMixingPercentage(2);
		}
		window.addEventListener("blur", onBlur);
		window.addEventListener("focus", onFocus);
		return () => {
			window.removeEventListener("blur", onBlur);
			window.removeEventListener("focus", onFocus);
		};
	}, []);

	return (
		<section
			className={cn(
				`tws-w-screen tws-max-w-[354px] tws-items-center tws-justify-between tws-gap-3 tws-p-2 tws-pb-2 tws-pr-2.5 tws-relative tws-z-[1000] tws-rounded-[22px] `,
				`tws-bg-[#1E1E1E] `,
				`tws-shadow-[0px_0px_1px_0.5px_rgba(231,229,228,0.6),_0px_0px_1px_2px_rgba(0,0,0,0.6)] `,
				classMemo,
			)}
		>
			<div className="tws-p-2 tws-px-3 tws-flex tws-items-center tws-gap-x-2.5 tws-rounded-full">
				<Button
					whileHover={undefined}
					onTap={() => simulatorAppWindow.close()}
					className="tws-size-3.5 tws-flex tws-items-center tws-justify-center !tws-text-[#460804] !tws-p-0 tws-rounded-full !tws-bg-red-400 hover:!tws-bg-red-500 tws-transition-colors tws-duration-150 tws-group "
				>
					<XIcon className="tws-size-3 tws-opacity-0 tws-transition-opacity tws-duration-100 group-hover:tws-opacity-100 " />
				</Button>
				<Button
					whileHover={undefined}
					onTap={() => simulatorAppWindow.minimize()}
					className="tws-size-3.5 tws-flex tws-items-center tws-justify-center !tws-text-[#90591d] !tws-p-0 tws-rounded-full !tws-bg-yellow-400 hover:!tws-bg-yellow-500 tws-transition-colors tws-duration-150 tws-group "
				>
					<MinusIcon className="tws-size-3 tws-opacity-0 tws-transition-opacity tws-duration-100 group-hover:tws-opacity-100 " />
				</Button>
				<Button
					whileHover={undefined}
					onTap={() => {
						setIsFullscreen(true);
						setDeviceFrameHeightClass(maxHeightMap.fullscreen);
					}}
					className="tws-size-3.5 tws-flex tws-items-center tws-justify-center !tws-text-[#2a6218] !tws-p-0 tws-rounded-full !tws-bg-green-400 hover:!tws-bg-green-500 tws-transition-colors tws-duration-150 tws-group "
				>
					<Maximize2Icon className="tws-size-2 tws-opacity-0 tws-transition-opacity tws-duration-100 group-hover:tws-opacity-100 " />
				</Button>
			</div>
			<div className="tws-flex tws-flex-col tws-justify-center tws-text-xs -tws-space-y-0.5 ">
				<p className="tws-text-white tws-font-bold ">
					{deviceDisplayName.displayName}
				</p>
				<p className="tws-text-stone-400 tws-font-medium ">
					{versionMemo as any}
				</p>
			</div>
			<LiquidGlass.div
				className="tws-p-2 tws-px-3 tws-flex tws-ml-auto tws-items-center tws-space-x-4 tws-rounded-full tws-transition-colors tws-duration-200 tws-ease-linear "
				tint={[uint8(255), uint8(255), uint8(255)]}
				tintOpacity={0.3}
				mixingPercentage={mixingPercentage}
			>
				<Button
					onTap={() => {
						setScreenState("before-close-app");
						setDeviceScreen("home-screen");
					}}
					className="!tws-p-0 tws-bg-transparent "
				>
					<Home className={"tws-size-[18px] tws-fill-white"} />
				</Button>
				<div
					className={cn(
						"tws-relative ",
						"after:tws-size-[130%] after:tws-block after:tws-absolute after:-tws-left-[2px] after:-tws-top-[3px] after:tws-z-20 after:tws-bg-white/5 after:tws-backdrop- after:tws-backdrop-blur-[2px] after:tws-rounded-full ",
						"after:tws-transition-opacity after:tws-duration-100 tws-ease-in-out ",
						"after:tws-opacity-0 after:tws-pointer-events-none ",
						{
							"after:tws-opacity-100 ": startBlur,
						},
					)}
				>
					<Button
						onTap={() => {
							setCommandModal("url-input", true);
						}}
						className={cn(
							"tws-size-[18px] tws-bg-transparent !tws-p-0",
							"tws-absolute tws-top-0 tws-left-0",
							{
								"-tws-z-10 tws-invisible tws-pointer-events-none ":
									deviceScreen === "home-screen",
								"tws-z-10": deviceScreen === "app-screen",
							},
						)}
					>
						<SearchIcon className={"tws-size-full tws-fill-white"} />
					</Button>
					{/* device select menu here */}
					<div
						className={cn("tws-relative", {
							"-tws-z-10 tws-invisible tws-pointer-events-none ":
								deviceScreen === "app-screen",
							"tws-z-10": deviceScreen === "home-screen",
						})}
					>
						<DeviceSelectMenu
							trigger={
								<DeviceFrameIcon
									className={cn("tws-size-[18px] tws-text-white ")}
								/>
							}
						/>
					</div>
				</div>
				<AppSettingsMenu
					trigger={<Settings className={"tws-size-[18px] tws-fill-white"} />}
				/>
			</LiquidGlass.div>
		</section>
	);
};

export default TopNavbar;
